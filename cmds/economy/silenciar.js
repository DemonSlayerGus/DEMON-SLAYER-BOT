export default {
  command: ['silenciar', 'mute'],
  category: 'economy',
  run: async ({ msg }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.sender

    const txt = `「🔇」 *SILENCIADO*\n\n@${who.split('@')[0]} no podrá hablar por 5 minutos\n*Motivo:* Mucho ruido 🫢`

    await msg.reply(txt, { mentions: [who] })
    await msg.react('🤐')
  }
}