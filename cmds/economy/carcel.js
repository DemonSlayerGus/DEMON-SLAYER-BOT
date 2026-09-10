export default {
  command: ['carcel', 'jail'],
  category: 'economy',
  run: async ({ msg }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.sender

    const txt = `「🚨」 *CÁRCEL*\n\n@${who.split('@')[0]} fue arrestado por 24h\n*Delito:* Ser muy sospechoso 👮`

    await msg.reply(txt, { mentions: [who] })
    await msg.react('🚔')
  }
}