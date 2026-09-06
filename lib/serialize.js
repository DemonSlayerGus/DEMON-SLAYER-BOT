import { proto, delay, areJidsSameUser, generateWAMessage, generateWAMessageFromContent, downloadContentFromMessage, getContentType, getDevice, extractMessageContent, jidDecode } from '@whiskeysockets/baileys';
import db from "#db"
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import path from 'path';
import exif from './exif.js';
import { fileURLToPath } from 'url';
import GraphemeSplitter from 'grapheme-splitter';

const splitter = new GraphemeSplitter();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = exif;

class BoundedMap {
  #map = new Map();
  #max;
  #ttl;
  constructor(max, ttlMs = 0) { this.#max = max; this.#ttl = ttlMs; }
  #expired(e) { return this.#ttl > 0 && Date.now() - e.ts > this.#ttl; }
  has(k) {
    const e = this.#map.get(k);
    if (!e) return false;
    if (this.#expired(e)) { this.#map.delete(k); return false; }
    return true;
  }
  get(k) {
    const e = this.#map.get(k);
    if (!e) return undefined;
    if (this.#expired(e)) { this.#map.delete(k); return undefined; }
    return e.v;
  }
  set(k, v) {
    if (this.#map.size >= this.#max) this.#map.delete(this.#map.keys().next().value);
    this.#map.set(k, { v, ts: Date.now() });
  }
}

const groupMetaCache = new Map();
const lidCache = new BoundedMap(2000, 24 * 60 * 60_000);
const META_TTL = 300_000;

const gcMeta = setInterval(() => {
  const now = Date.now();
  for (const [key, val] of groupMetaCache)
    if (now - val.ts > META_TTL) groupMetaCache.delete(key);
}, 10 * 60 * 1000);
gcMeta.unref();

export function getCachedMeta(groupJid) {
  const c = groupMetaCache.get(groupJid);
  if (!c || Date.now() - c.ts > META_TTL) return null;
  return c.metadata;
}

export function setCachedMeta(groupJid, metadata) {
  groupMetaCache.set(groupJid, { metadata, ts: Date.now() });
}

export function deleteCachedMeta(groupJid) {
  groupMetaCache.delete(groupJid);
}

export function normalizeJid(raw) {
  if (!raw) return null;
  const s = typeof raw === 'number'? String(raw) : String(raw).trim();
  if (!s) return null;
  if (s.endsWith('@g.us')) return s;
  if (s.endsWith('@newsletter')) return s;
  if (s.endsWith('@lid')) return s;
  if (/:\d+@/i.test(s)) {
    const decoded = jidDecode(s);
    if (decoded?.user && decoded?.server) return `${decoded.user}@${decoded.server}`;
  }
  if (s.endsWith('@s.whatsapp.net')) return s;
  const digits = s.replace(/\D/g, '');
  if (digits && digits.length >= 4 && digits.length <= 15) return `${digits}@s.whatsapp.net`;
  return s;
}

export function resolveParticipantJid(p, sock) {
  if (!p) return null;
  if (p.phoneNumber) {
    const n = normalizeJid(p.phoneNumber);
    if (n &&!n.endsWith('@lid')) return n;
  }
  if (p.id &&!p.id.endsWith('@lid')) {
    const n = normalizeJid(p.id);
    if (n &&!n.endsWith('@lid')) return n;
  }
  if (p.jid &&!p.jid.endsWith('@lid')) {
    const n = normalizeJid(p.jid);
    if (n &&!n.endsWith('@lid')) return n;
  }
  const rawLid = p.lid || (p.id?.endsWith('@lid')? p.id : null) || (p.jid?.endsWith('@lid')? p.jid : null);
  if (rawLid) {
    if (lidCache.has(rawLid)) return lidCache.get(rawLid);
    if (typeof sock.findJidByLid === 'function') {
      const found = sock.findJidByLid(rawLid);
      if (found &&!found.endsWith('@lid')) {
        const r = normalizeJid(found);
        if (r) { lidCache.set(rawLid, r); return r; }
      }
    }
    return rawLid;
  }
  return null;
}

function resolveParticipants(participants, sock) {
  if (!Array.isArray(participants)) return [];
  return participants.map(p => {
    const realJid = resolveParticipantJid(p, sock);
    if (!realJid) return p;
    const originalLid = p.lid || (p.id?.endsWith('@lid')? p.id : undefined) || (p.jid?.endsWith('@lid')? p.jid : undefined);
    return {...p, id: realJid,...(originalLid? { lid: originalLid } : {}),...(p.phoneNumber? { phoneNumber: p.phoneNumber } : {}) };
  }).filter(p => p.id);
}

export function resolveJidSync(raw, sock) {
  if (!raw) return null;
  const norm = normalizeJid(raw);
  if (!norm) return null;
  if (!norm.endsWith('@lid')) return norm;
  if (lidCache.has(norm)) return lidCache.get(norm);
  if (typeof sock.findJidByLid === 'function') {
    const found = sock.findJidByLid(norm);
    if (found &&!found.endsWith('@lid')) {
      const r = normalizeJid(found);
      if (r) { lidCache.set(norm, r); return r; }
    }
  }
  return norm;
}

async function resolveJidAsync(raw, sock, groupJid) {
  if (!raw) return null;
  const norm = normalizeJid(raw);
  if (!norm) return null;
  if (!norm.endsWith('@lid')) return norm;
  const sync = resolveJidSync(norm, sock);
  if (sync &&!sync.endsWith('@lid')) return sync;
  if (!groupJid ||!groupJid.endsWith('@g.us')) return norm;
  const lidBase = norm.split('@')[0];
  let meta = getCachedMeta(groupJid);
  if (!meta) {
    try { meta = await sock.groupMetadata(groupJid); if (meta?.participants) setCachedMeta(groupJid, meta); else meta = null; }
    catch { return norm; }
  }
  for (const p of meta.participants?? []) {
    const pLidBase = p.lid?.split('@')[0];
    const pIdBase = (p.id &&!p.id.endsWith('@lid'))? p.id.split('@')[0] : null;
    if (pLidBase!== lidBase && pIdBase!== lidBase) continue;
    const phone = p.phoneNumber? normalizeJid(p.phoneNumber) : (p.id &&!p.id.endsWith('@lid')? normalizeJid(p.id) : null);
    if (phone) { lidCache.set(norm, phone); return phone; }
  }
  return norm;
}

export function patchGroupMetadata(sock) {
  if (sock.groupMetadataPatched) return;
  sock.groupMetadataPatched = true;
  const orig = sock.groupMetadata.bind(sock);
  sock.groupMetadata = async (jid) => {
    try {
      const meta = await orig(jid);
      if (!meta?.participants) return meta;
      meta.participants = resolveParticipants(meta.participants, sock);
      return meta;
    } catch (e) {
      return null;
    }
  };
}

export async function getBuffer(url, options = {}) {
  try {
    const res = await axios({ method: 'get', url, headers: { DNT: 1, 'Upgrade-Insecure-Request': 1 }, responseType: 'arraybuffer', timeout: 30_000,...options });
    return res.data;
  } catch (e) { throw e; }
}

export async function smsg(sock, msg, store) {
  const botId = sock.user?.id.split(':')[0] + '@s.whatsapp.net' || '';
  const botSetting = await db.getSettings(botId) || {};
  if (!sock.decodeJid) {
    sock.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        const decoded = jidDecode(jid) || {};
        return (decoded.user && decoded.server && decoded.user + '@' + decoded.server) || jid;
      }
      return jid;
    };
  }
  patchGroupMetadata(sock);
  if (!sock.downloadMediaMessage) {
  sock.downloadMediaMessage = async (message) => {
    const m = message.msg || message;
    const mime = m.mimetype || '';
    const messageType = (message.type || mime.split('/')[0]).replace(/Message/gi, '');
    const stream = await downloadContentFromMessage(m, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };
  }
  if (!msg) return msg;
  if (msg.key) {
    msg.id = msg.key.id;
    msg.chat = msg.key.remoteJid;
    msg.fromMe = msg.key.fromMe;
    msg.isBot = ['HSK', 'BAE', 'B1E', '3EB0', 'B24E', 'WA'].some((a) => msg.id.startsWith(a) && [12, 16, 20, 22, 40].includes(msg.id.length)) || /(.)\1{5,}|[^a-zA-Z0-9]|[^0-9A-F]/.test(msg.id) || false;
    msg.isGroup = msg.chat?.endsWith('@g.us')?? false;
    if (!msg.isGroup && msg.chat?.endsWith('@lid')) {
      const resolved = await resolveJidAsync(msg.chat, sock, null);
      if (resolved &&!resolved.endsWith('@lid')) msg.chat = resolved;
    }
    const rawSender = (msg.fromMe && sock.user.id) || msg.key?.participant || msg.key?.remoteJid || '';
    msg.sender = await resolveJidAsync(sock.decodeJid(rawSender), sock, msg.key?.remoteJid);
  }

  if (msg.message) {
    msg.type = getContentType(msg.message) || Object.keys(msg.message)[0];
    msg.msg = /viewOnceMessage|viewOnceMessageV2Extension|editedMessage|ephemeralMessage/i.test(msg.type)? msg.message[msg.type].message[getContentType(msg.message[msg.type].message)] : extractMessageContent(msg.message[msg.type]) || msg.message[msg.type];
    msg.body = msg.message?.conversation || msg.msg?.text || msg.msg?.conversation || msg.msg?.caption || msg.msg?.selectedButtonId || msg.msg?.singleSelectReply?.selectedRowId || msg.msg?.selectedId || msg.msg?.contentText || msg.msg?.selectedDisplayText || msg.msg?.title || msg.msg?.name || '';

    const rawMentioned = msg.msg?.contextInfo?.mentionedJid?? [];
    let metaParticipants = null;
    if (msg.isGroup && rawMentioned.some(j => j?.endsWith('@lid'))) {
      try {
        const meta = getCachedMeta(msg.chat)?? await sock.groupMetadata(msg.chat).catch(() => null);
        if (meta) setCachedMeta(msg.chat, meta);
        metaParticipants = meta?.participants?? null;
      } catch {}
    }
    const resolveMentionJid = (raw) => {
      if (!raw) return null;
      const norm = normalizeJid(raw);
      if (!norm) return null;
      if (!norm.endsWith('@lid')) return norm;
      const sync = resolveJidSync(norm, sock);
      if (sync &&!sync.endsWith('@lid')) return sync;
      if (metaParticipants) {
        const lidBase = norm.split('@')[0];
        for (const p of metaParticipants) {
          if (p.lid?.split('@')[0] === lidBase) return p.id;
          if (p.id?.split('@')[0] === lidBase) return p.id;
        }
      }
      return norm;
    };
    msg.mentionedJid = rawMentioned.map(resolveMentionJid).filter(Boolean);
    msg.text = msg.msg?.text || msg.msg?.caption || msg.message?.conversation || msg.msg?.contentText || msg.msg?.selectedDisplayText || msg.msg?.title || '';
    let activePrefixes = [];
    if (botSetting.prefijo === 1) activePrefixes = [];
    else if (Array.isArray(botSetting.prefijo)) activePrefixes = botSetting.prefijo;
    else if (typeof botSetting.prefijo === 'string') activePrefixes = splitter.splitGraphemes(botSetting.prefijo);
    else activePrefixes = ['#', '/', '-', '+', '.', '!'];
    msg.usedPrefix = '';
    for (const p of activePrefixes) { if (msg.body?.startsWith(p)) { msg.usedPrefix = p; break; } }
    msg.command = msg.body && msg.body.replace(msg.usedPrefix, '').trim().split(/ +/).shift();
    msg.args = msg.body?.trim().replace(new RegExp('^' + (msg.usedPrefix || '').replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&'), 'i'), '').replace(msg.command, '').split(/ +/).filter((a) => a) || [];
    msg.device = getDevice(msg.id);
    msg.expiration = msg.msg?.contextInfo?.expiration || msg?.metadata?.ephemeralDuration || sock.messages?.[msg.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0;
    msg.timestamp = (typeof msg.messageTimestamp === 'number'? msg.messageTimestamp : msg.messageTimestamp?.low || msg.messageTimestamp?.high) || (msg.msg?.timestampMs * 1000);
    msg.isMedia =!!msg.msg?.mimetype ||!!msg.msg?.thumbnailDirectPath;
    if (msg.isMedia) {
      msg.mime = msg.msg?.mimetype;
      msg.size = msg.msg?.fileLength;
      msg.height = msg.msg?.height || '';
      msg.width = msg.msg?.width || '';
      if (/webp/i.test(msg.mime)) msg.isAnimated = msg.msg?.isAnimated;
    }
    msg.quoted = msg.msg?.contextInfo?.quotedMessage? {} : null;
    if (msg.quoted) {
      msg.quoted.message = extractMessageContent(msg.msg?.contextInfo?.quotedMessage);
      msg.quoted.type = getContentType(msg.quoted.message) || Object.keys(msg.quoted.message)[0];
      msg.quoted.msg = extractMessageContent(msg.quoted.message[msg.quoted.type]) || msg.quoted.message[msg.quoted.type];
      msg.quoted.id = msg.msg.contextInfo.stanzaId;
      msg.quoted.device = getDevice(msg.quoted.id);
      msg.quoted.chat = msg.msg.contextInfo.remoteJid || msg.chat;
      msg.quoted.isBot = msg.quoted.id? ['HSK', 'BAE', 'B1E', '3EB0', 'B24E', 'WA'].some((a) => msg.quoted.id.startsWith(a) && [12, 16, 20, 22, 40].includes(msg.quoted.id.length)) || /(.)\1{5,}|[^a-zA-Z0-9]|[^0-9A-F]/.test(msg.quoted.id) : false;
      const rawQP = msg.msg?.contextInfo?.participant?? '';
      msg.quoted.sender = await resolveJidAsync(sock.decodeJid(rawQP), sock, msg.chat);
      msg.quoted.fromMe = areJidsSameUser(msg.quoted.sender, sock.decodeJid(sock.user.id));
      msg.quoted.text = msg.quoted.msg?.text || msg.quoted.msg?.caption || msg.quoted.msg?.conversation || msg.quoted.msg?.contentText || msg.quoted.msg?.selectedDisplayText || msg.quoted.msg?.title || '';
      msg.quoted.body = msg.quoted.msg?.text || msg.quoted.msg?.caption || msg.quoted.message?.conversation || msg.quoted.msg?.selectedButtonId || msg.quoted.msg?.singleSelectReply?.selectedRowId || msg.quoted.msg?.selectedId || msg.quoted.msg?.contentText || msg.quoted.msg?.selectedDisplayText || msg.quoted.msg?.title || msg.quoted.msg?.name || '';
      msg.quoted.mentionedJid = (msg.quoted.msg?.contextInfo?.mentionedJid?? []).map(resolveMentionJid).filter(Boolean);
      msg.quoted.mentions = msg.quoted.mentionedJid;
      msg.quoted.isGroup = msg.quoted.chat?.endsWith('@g.us');
      let quotedPrefix = '';
      for (const p of activePrefixes) { if (msg.quoted.body?.startsWith(p)) { quotedPrefix = p; break; } }
      msg.quoted.usedPrefix = quotedPrefix;
      msg.quoted.command = msg.quoted.body && msg.quoted.body.replace(msg.quoted.usedPrefix, '').trim().split(/ +/).shift();
      msg.quoted.isMedia =!!msg.quoted.msg?.mimetype ||!!msg.quoted.msg?.thumbnailDirectPath;
      if (msg.quoted.isMedia) {
        msg.quoted.fileSha256 = msg.quoted[msg.quoted.type]?.fileSha256 || '';
        msg.quoted.mime = msg.quoted.msg?.mimetype;
        msg.quoted.size = msg.quoted.msg?.fileLength;
        msg.quoted.height = msg.quoted.msg?.height || '';
        msg.quoted.width = msg.quoted.msg?.width || '';
        if (/webp/i.test(msg.quoted.mime)) msg.quoted.isAnimated = msg.quoted?.msg?.isAnimated || false;
      }
      msg.quoted.key = { remoteJid: msg.msg?.contextInfo?.remoteJid || msg.chat, participant: msg.quoted.sender, fromMe: areJidsSameUser(sock.decodeJid(msg.msg?.contextInfo?.participant), sock.decodeJid(sock.user?.id)), id: msg.msg?.contextInfo?.stanzaId };
      msg.quoted.fakeObj = proto.WebMessageInfo.fromObject({ key: { remoteJid: msg.quoted.chat, fromMe: msg.quoted.fromMe, id: msg.quoted.id }, message: msg.quoted.message,...(msg.isGroup? { participant: msg.quoted.sender } : {}) });
      msg.getQuotedObj = async () => {
        if (!msg.quoted.id) return false;
        const q = store? await store.loadMessage(msg.chat, msg.quoted.id).catch(() => null) : null;
        return await smsg(sock, q);
      };
      msg.quoted.download = () => sock.downloadMediaMessage(msg.quoted);
      msg.quoted.delete = () => {
        sock.sendMessage(msg.quoted.chat, { delete: { remoteJid: msg.quoted.chat, fromMe: msg.isBotAdmin? false : true, id: msg.quoted.id, participant: msg.quoted.sender } });
      };
    }
  }
  msg.download = () => sock.downloadMediaMessage(msg);
  msg.copy = () => smsg(sock, proto.WebMessageInfo.fromObject(proto.WebMessageInfo.toObject(msg)));
  msg.react = (u) => sock.sendMessage(msg.chat, { react: { text: u, key: msg.key } });
  msg.copyNForward = (jid = msg.chat, forceForward = false, options = {}) => sock.copyNForward(jid, msg, forceForward, options);

  msg.reply = async (content, options = {}) => {
    const quoted = msg;
    const chat = msg.chat;
    const caption = '';
    const ephemeralExpiration = msg.expiration;
    const mentions = '';
    if (typeof content === 'object') {
      return sock.sendMessage(chat, content, {...options, quoted, ephemeralExpiration });
    } else if (typeof content === 'string') {
      try {
        if (/^https?:\/\//.test(content)) {
          const data = await axios.get(content, { responseType: 'arraybuffer' });
          const mime = data.headers['content-type'];
          if (/gif|image|video|audio|pdf|stream/i.test(mime)) {
            return sock.sendMessage(chat, { [mime.split('/')[0]]: data.data, caption }, { quoted, ephemeralExpiration });
          } else {
            return sock.sendMessage(chat, { text: content, mentions,...options }, { quoted, ephemeralExpiration });
          }
        } else {
          return sock.sendMessage(chat, { text: content, mentions,...options }, { quoted, ephemeralExpiration });
        }
      } catch (e) {
        return sock.sendMessage(chat, { text: content, mentions,...options }, { quoted, ephemeralExpiration });
      }
    }
  };

  if (!sock.parseMention) {
  sock.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');
  };
  }

  if (!sock.sendImageAsSticker) {
  sock.sendImageAsSticker = async (jid, p, quoted, options = {}) => {
    const buff = Buffer.isBuffer(p)? p : /^data:.*?\/.*?;base64,/i.test(p)? Buffer.from(p.split`,`[1], 'base64') : /^https?:\/\//.test(p)? await getBuffer(p) : fs.existsSync(p)? fs.readFileSync(p) : Buffer.alloc(0);
    const buffer = (options.packname || options.author)? await writeExifImg(buff, options) : await imageToWebp(buff);
    await sock.sendMessage(jid, { sticker: { url: buffer },...options }, { quoted });
    return buffer;
  };
  }

  if (!sock.sendVideoAsSticker) {
  sock.sendVideoAsSticker = async (jid, p, quoted, options = {}) => {
    const buff = Buffer.isBuffer(p)? p : /^data:.*?\/.*?;base64,/i.test(p)? Buffer.from(p.split`,`[1], 'base64') : /^https?:\/\//.test(p)? await getBuffer(p) : fs.existsSync(p)? fs.readFileSync(p) : Buffer.alloc(0);
    const buffer = (options.packname || options.author)? await writeExifVid(buff, options) : await videoToWebp(buff);
    await sock.sendMessage(jid, { sticker: { url: buffer },...options }, { quoted });
    return buffer;
  };
  }

  return msg;
}