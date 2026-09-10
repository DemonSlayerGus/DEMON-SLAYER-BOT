export default {
  command: ['balazo', 'disparo'],
  category: 'economy',
  run: async ({ msg }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.sender
    let daño = Math.floor(Math.random() * 100) + 1

    const txt = `「🔫」 *BALAZO*\n\nBang bang! @${who.split('@')[0]} recibió un balazo\n\n*Daño:* ${daño} HP\n\n*Vida restante:* ${100 - daño} HP`

    await msg.reply(txt, { mentions: [who] })
    await msg.react('💥')
  }
}