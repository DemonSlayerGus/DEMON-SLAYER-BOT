export default {
  command: ['mute', 'unmute'],
  category: 'group',
  group: true,
  admin: true,
  botAdmin: true,
  run: async ({ msg, sock, args, command }) => {
    global.muteados = global.muteados || {}
    const chat = msg.chat

    let users = msg.mentionedJid || []
    if (users.length === 0 && msg.quoted) users.push(msg.quoted.sender)
    if (users.length === 0) return msg.reply(`「✦」Menciona o responde al mensaje de la persona\n> ✐ Ejemplo » *.mute @usuario*`)

    const user = users[0]
    global.muteados[chat] = global.muteados[chat] || []

    if (command === 'mute') {
      if (global.muteados[chat].includes(user)) return msg.reply('「✦」Ese usuario ya está muteado')
      global.muteados[chat].push(user)
      await msg.reply(`「✦」Usuario muteado correctamente\n> 👤 @${user.split('@')[0]}\n> 🗑️ Todos sus mensajes serán eliminados`, { mentions: [user] })
    }

    if (command === 'unmute') {
      if (!global.muteados[chat].includes(user)) return msg.reply('「✦」Ese usuario no está muteado')
      global.muteados[chat] = global.muteados[chat].filter(u => u!== user)
      await msg.reply(`「✦」Usuario desmuteado\n> 👤 @${user.split('@')[0]}`, { mentions: [user] })
    }

    await msg.react('✅')
  }
}