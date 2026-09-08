export default {
  command: ['kick', 'echar', 'sacar', 'ban'],
  category: 'group',
  run: async ({ msg, sock, args }) => {
    const chat = msg.chat
    const metadata = await sock.groupMetadata(chat)

    if (!metadata) return msg.reply('「✦」Este comando solo funciona en grupos')

    const botNumber = await sock.decodeJid(sock.user.id)
    const senderAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin
    const botAdmin = metadata.participants.find(p => p.id === botNumber)?.admin

    if (!senderAdmin) return msg.reply('「✦」Solo los *admins* pueden usar este comando')
    if (!botAdmin) return msg.reply('「✦」Necesito ser *admin* para poder expulsar')

    // Obtener a quien expulsar
    let users = msg.mentionedJid || []
    if (users.length === 0 && msg.quoted) users.push(msg.quoted.sender)

    if (users.length === 0) {
      return msg.reply(`「✦」Menciona o responde al mensaje de la persona a expulsar\n> ✐ Ejemplo » *.kick @usuario*`)
    }

    const user = users[0]

    // No se puede expulsar al bot ni a admins
    if (user === botNumber) return msg.reply('「✦」No puedo expulsarme a mí mismo')
    if (user === msg.sender) return msg.reply('「✦」No puedes expulsarte a ti mismo')

    const targetAdmin = metadata.participants.find(p => p.id === user)?.admin
    if (targetAdmin) return msg.reply('「✦」No puedo expulsar a otro *admin*')

    try {
      await sock.groupParticipantsUpdate(chat, [user], 'remove')
      await msg.reply(`「✦」Usuario expulsado correctamente\n> 👤 @${user.split('@')[0]}`)
      await msg.react('✅')
    } catch (e) {
      console.error(e)
      await msg.react('❌')
      msg.reply('「✦」No se pudo expulsar al usuario')
    }
  }
}