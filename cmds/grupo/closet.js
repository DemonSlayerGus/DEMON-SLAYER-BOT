import db from "#db"

function parseTime(str) {
  const match = str.match(/^(\d+)(min|h|d|mes)$/i)
  if (!match) return null
  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()
  switch (unit) {
    case 'min': return num * 60 * 1000
    case 'h': return num * 60 * 60 * 1000
    case 'd': return num * 24 * 60 * 60 * 1000
    case 'mes': return num * 30 * 24 * 60 * 60 * 1000
    default: return null
  }
}

async function ejecutarAccion(sock, chatId) {
  await sock.groupSettingUpdate(chatId, 'not_announcement')
  await sock.sendMessage(chatId, { text: `✨ *El grupo ha sido abierto por Demon Slayer*` })
  
  const chat = await db.getChat(chatId)
  let acciones = typeof chat.scheduledActions === 'string'
    ? JSON.parse(chat.scheduledActions)
    : chat.scheduledActions || []
  acciones = acciones.filter(t => !(t.action === 'open' && t.expiresAt <= Date.now()))
  await db.updateChat(chatId, 'scheduledActions', acciones)
}

async function scheduleGroupAction(chatId, ms, sock) {
  const expiresAt = Date.now() + ms
  const task = { action: 'open', expiresAt }
  const chat = await db.getChat(chatId)
  const tasks = typeof chat.scheduledActions === 'string'
    ? JSON.parse(chat.scheduledActions)
    : chat.scheduledActions || []
  tasks.push(task)
  await db.updateChat(chatId, 'scheduledActions', tasks)
  setTimeout(() => ejecutarAccion(sock, chatId), ms)
}

export default {
  command: ['closet', 'cerrar'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async ({ msg, sock, args }) => {
    const groupMetadata = await sock.groupMetadata(msg.chat)
    const groupAnnouncement = groupMetadata.announce

    if (!args.length) {
      await db.updateChat(msg.chat, 'scheduledActions', [])
      if (groupAnnouncement === true) {
        return sock.sendMessage(msg.chat, { text: `⚔️ *El grupo ya ha sido cerrado por Demon Slayer*` }, { quoted: msg })
      }
      await sock.groupSettingUpdate(msg.chat, 'announcement')
      return sock.sendMessage(msg.chat, { text: `🩸 *El grupo ha sido cerrado por Demon Slayer*\nSolo los admins pueden hablar.` }, { quoted: msg })
    }
    
    const ms = parseTime(args[0])
    if (!ms) return sock.sendMessage(msg.chat, { text: `✎ *Formato inválido*\nUsa: 1min, 6h, 2d, 1mes` }, { quoted: msg })

    await sock.groupSettingUpdate(msg.chat, 'announcement')
    await sock.sendMessage(msg.chat, { text: `🩸 *El grupo ha sido cerrado por Demon Slayer*\n⏰ Se abrirá en: *${args[0]}*` }, { quoted: msg })
    await scheduleGroupAction(msg.chat, ms, sock)
  }
}