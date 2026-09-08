export default {
  command: ['invocar', 'todos', 'tagall'],
  category: 'group',
  run: async ({ msg, sock, args }) => {
    const chat = msg.chat
    const metadata = await sock.groupMetadata(chat)
    const participants = metadata.participants

    if (!metadata) return msg.reply('「✦」Este comando solo funciona en grupos')
    
    // Verificar si quien manda es admin
    const botNumber = await sock.decodeJid(sock.user.id)
    const isAdmin = participants.find(p => p.id === msg.sender)?.admin
    const isBotAdmin = participants.find(p => p.id === botNumber)?.admin

    if (!isAdmin) return msg.reply('「✦」Solo los *admins* pueden usar este comando')
    if (!isBotAdmin) return msg.reply('「✦」Necesito ser *admin* para mencionar a todos')

    const texto = args.join(' ')
    let mensaje = `ꕥ ꨩᰰ𑪐𑂺 ˳ ׄ 𝖨𝖭𝖵𝖮𝖢𝖠𝖭𝖣𝖮 ࣭𑁯ᰍ ̊ ܃\n\n`
    
    if (texto) mensaje += `> 📢 *Mensaje:* ${texto}\n\n`
    mensaje += `> 👥 *Miembros:* ${participants.length}\n\n`
    
    // Mencionar a todos
    const mentions = participants.map(p => p.id)
    mensaje += participants.map(p => `• @${p.id.split('@')[0]}`).join('\n')

    await sock.sendMessage(chat, {
      text: mensaje,
      mentions: mentions
    }, { quoted: msg })

    await msg.react('📢')
  }
}