import db from "#db"

const initDB = () => {
  if (!db.data) db.data = {}
  if (!db.data.users) db.data.users = {}
  if (!db.data.chats) db.data.chats = {}
}

export default {
  command: ['antiporno', 'antinsfw'],
  category: 'group',
  group: true,
  admin: true,
  run: async ({ msg, sock, args }) => {
    initDB()
    if (!db.data.chats[msg.chat]) db.data.chats[msg.chat] = { antiporno: false }

    const option = args[0]?.toLowerCase()
    if (option === 'on') {
      db.data.chats[msg.chat].antiporno = true
      return sock.sendMessage(msg.chat, { text: `🔞 *Anti-Porno Activado*\n\nAhora se borrarán mensajes con palabras NSFW` }, { quoted: msg })
    }
    if (option === 'off') {
      db.data.chats[msg.chat].antiporno = false
      return sock.sendMessage(msg.chat, { text: `✅ *Anti-Porno Desactivado*` }, { quoted: msg })
    }
    return sock.sendMessage(msg.chat, { text: `✿ Uso:.antiporno on / off\nEstado: ${db.data.chats[msg.chat].antiporno? 'ON 🔞' : 'OFF ✅'}` }, { quoted: msg })
  },

  before: async ({ msg, sock }) => {
    if (!msg.chat.endsWith('@g.us')) return
    initDB()
    if (!db.data.chats[msg.chat]?.antiporno) return

    const groupMetadata = await sock.groupMetadata(msg.chat)
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
    if (!botAdmin) return

    const sender = msg.sender
    if (!db.data.users[sender]) db.data.users[sender] = { warn: 0 }

    // SACAR TEXTO DE DONDE SEA
    const type = Object.keys(msg.message || {})[0]
    let text = ''
    if (type === 'conversation') text = msg.message.conversation
    else if (msg.message[type]?.caption) text = msg.message[type].caption
    else if (msg.message[type]?.text) text = msg.message[type].text

    text = text.toLowerCase()
    const suspiciousWords = ['pack', 'nude', 'sex', 'porn', 'xxx', '18+', 'porno', 'hentai']

    const detected = suspiciousWords.some(w => text.includes(w))

    if (detected) {
      try {
        // 1. BORRAR
        await sock.sendMessage(msg.chat, { delete: msg.key })

        // 2. WARN
        db.data.users[sender].warn += 1
        let warns = db.data.users[sender].warn

        if (warns >= 3) {
          await sock.groupParticipantsUpdate(msg.chat, [sender], 'remove')
          await sock.sendMessage(msg.chat, {
            text: `🔞 @${sender.split('@')[0]} *EXPULSADO*\nMotivo: NSFW x3`,
            mentions: [sender]
          })
          db.data.users[sender].warn = 0
        } else {
          await sock.sendMessage(msg.chat, {
            text: `🔞 *PALABRA PROHIBIDA DETECTADA*\n\n@${sender.split('@')[0]} Warn ${warns}/3\nSi llegas a 3 = Kick`,
            mentions: [sender]
          })
        }
      } catch (e) {
        console.log("Error antiporno: ", e)
        sock.sendMessage(msg.chat, { text: `🚩 No pude borrar el mensaje. Dame permiso de admin` })
      }
    }
  }
}