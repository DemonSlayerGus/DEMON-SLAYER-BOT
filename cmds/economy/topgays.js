export default {
  command: ['topgays', 'topgay'],
  alias: ['/topgay', '/topgays', '/rankgays'],
  category: 'economia',
  desc: 'Muestra el Top Gays mencionando a todos',
  uso: '',
  run: async ({ msg, sock }) => {
    const chat = msg.chat
    const metadata = await sock.groupMetadata(chat)
    const participants = metadata.participants

    if (!metadata) return msg.reply('「✦」Este comando solo funciona en grupos')

    const mensaje = `🏳️‍🌈 *TOP GAYS DEL GRUPO* 🏳️‍🌈

> 👥 *Total miembros:* ${participants.length}

${participants.map(p => `• @${p.id.split('@')[0]}`).join('\n')}

✧ ¡Aquí están todos! 🏳️‍🌈✨`

    await sock.sendMessage(chat, {
      text: mensaje,
      mentions: participants.map(p => p.id)
    }, { quoted: msg })

    await msg.react('🏳️‍🌈')
  }
}
