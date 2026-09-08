// Guardamos los muteados en memoria. Si reinicias se borra
global.muteados = global.muteados || {}

export default {
  command: ['mute', 'unmute'],
  category: 'group',
  run: async ({ msg, sock, args, command }) => {
    const chat = msg.chat
    const metadata = await sock.groupMetadata(chat)

    if (!metadata) return msg.reply('「✦」Este comando solo funciona en grupos')

    const botNumber = await sock.decodeJid(sock.user.id)
    const senderAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin
    const botAdmin = metadata.participants.find(p => p.id === botNumber)?.admin

    if (!senderAdmin) return msg.reply('「✦」Solo los *admins* pueden usar este comando')
    if (!botAdmin) return msg.reply('「✦」Necesito ser *admin* para poder borrar mensajes')

    let users = msg.mentionedJid || []
    if (users.length === 0 && msg.quoted) users.push(msg.quoted.sender)

    if (users.length === 0) {
      return msg.reply(`「✦」Menciona o responde al mensaje de la persona\n> ✐ Ejemplo » *.mute @usuario*`)
    }

    const user = users[0]
    global.muteados[chat] = global.muteados[chat] || []

    if (command === 'mute') {
      if (global.muteados[chat].includes(user)) return msg.reply('「✦」Ese usuario ya está muteado')
      global.muteados[chat].push(user)
      await msg.reply(`「✦」Usuario muteado correctamente\n> 👤 @${user.split('@')[0]}\n> 🗑️ Todos sus mensajes serán eliminados`)
    }

    if (command === 'unmute') {
      if (!global.muteados[chat].includes(user)) return msg.reply('「✦」Ese usuario no está muteado')
      global.muteados[chat] = global.muteados[chat].filter(u => u!== user)
      await msg.reply(`「✦」Usuario desmuteado\n> 👤 @${user.split('@')[0]}`)
    }

    await msg.react('✅')
  }
}