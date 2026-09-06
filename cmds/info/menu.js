import db from "#db"
import { getDevice } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';
import { commands } from '../../lib/system/comandos.js';

export default {
  command: ['allmenu', 'help', 'menu', 'shinobi', 'demon', 'ds'],
  alias: ['allmenu', 'help', 'menu', 'shinobi', 'demon', 'ds'],
  category: 'info',
  desc: 'Muestra el menú completo de DEMON SLAYER BOT',
  uso: '[categoria]',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    try {
      const now = new Date();
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const fecha = colombianTime.toLocaleDateString('en-GB', {day: '2-digit',month: 'short',year: 'numeric'}).replace(/,/g, '');
      const hora = moment.tz('America/Bogota').format('hh:mm A');

      const botId = sock?.user?.id.split(':')[0] + '@s.whatsapp.net' || '';
      const botSettings = await db.getSettings(botId);
      const botname = 'DEMON SLAYER BOT';
      const imageUrl = 'https://tinyurl.com/27qw997h';
      const owner = 'LORD GUS';
      const link = 'https://chat.whatsapp.com/L9ngYDb5e574vNddUJGD1t?s=cl&p=a&ilr=0';

      const canalId = '120363428584260360@newsletter';
      const canalName = '✧ DEMON SLAYER BOT ✧';

      const botType = 'Cazador de Demonios';
      const allUsers = await db.getUser();
      const users = Object.keys(allUsers || {}).length || 0;
      const time = sock.uptime? formatearMs(Date.now() - sock.uptime) : 'Desconocido';
      const device = getDevice(msg.key.id);

      // HEADER GOD
      let menu = `*╭━━━━━━━━━━━━━━━╮*
*┃* 🩸 *DEMON SLAYER BOT* 🩸
*╰━━━━━━━━━━━━━━━╯*

*꒰ঌ 🥷 ໒꒱ Konichiwa* ${msg.pushName} *-san*
*꒰ঌ ⚔️ ໒꒱ Bienvenido al Cuerpo de Cazadores*

*╭─〔 📜 DATOS DEL CUARTEL 〕─╮*
*│* 👑 *Comandante:* ${owner}
*│* 🤖 *Tipo:* ${botType}
*│* 📱 *Dispositivo:* ${device}
*│* 📅 *Fecha:* ${fecha}
*│* 🕐 *Hora:* ${hora}
*│* 👥 *Cazadores:* ${users.toLocaleString()}
*│* ⏱️ *Uptime:* ${time}
*│* 🏯 *Sede:* ${link}
*╰────────────────────╯*

*✧━━━━━━━━━━━✧*
* TÉCNICAS DISPONIBLES*
*✧━━━━━━━━━━━✧*
`;

      const categoryArg = args[0]?.toLowerCase();
      const categories = {};
      for (const cmd of commands) {
        const category = cmd.category || 'otros';
        if (!categories[category]) categories[category] = [];
        categories[category].push(cmd);
      }

      if (categoryArg &&!categories[categoryArg]) {
        return await msg.reply(`《🩸》 La *Técnica ${categoryArg}* no fue encontrada.\nUsa: *${prefix}menu* para ver todas`);
      }

      const catEmojis = {
        info: '📜', downloader: '📥', fun: '🎭', group: '👥',
        owner: '👑', ai: '🤖', sticker: '🏷️', search: '🔍', otros: '⚔️'
      }

      const catNamesDS = {
        info: 'INFORMACIÓN', downloader: 'DESCARGAS', fun: 'ENTRETENIMIENTO',
        group: 'CUARTEL', owner: 'COMANDANTE', ai: 'IA HASHIRA',
        sticker: 'CALCOMANÍAS', search: 'BÚSQUEDA', otros: 'TÉCNICAS'
      }

      for (const [category, cmds] of Object.entries(categories)) {
        if (categoryArg && category.toLowerCase()!== categoryArg) continue;
        const catName = catNamesDS[category] || category.toUpperCase();
        const emoji = catEmojis[category] || '⚔️';

        menu += `\n*╭───〔 ${emoji} ${catName} 〕───╮*\n`;
        cmds.forEach((cmd) => {
          const aliases = cmd.alias.map((a) => {
            const aliasClean = a.split(/[\/#!+.\-]+/).pop().toLowerCase()
            return `*${prefix}${aliasClean}*`
          }).join(' │ ')
          menu += `*│* 🗡️ ${aliases}${cmd.uso? ` *${cmd.uso}*` : ''}\n`
          menu += `*│* └─ ${cmd.desc}\n`
        })
        menu += `*╰─────────────────╯*\n`
      }

      menu += `\n*꒰ঌ 🩸 ໒꒱ "Respira... y corta"* ꒰ঌ 🩸 ໒꒱\n*✧ ${botname} - by ${owner} ✧*`;

      await sock.sendMessage(msg.chat, {
        image: { url: imageUrl },
        caption: menu.trim(),
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalId,
            newsletterName: canalName,
            serverMessageId: -1,
          }
        }
      }, { quoted: msg });

    } catch (e) {
      console.log(e)
      await msg.reply('《🩸》 Error al cargar el menú: ' + e.message);
    }
  },
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`].filter(Boolean).join(' ');
}