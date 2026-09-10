export default {
  command: ['leydehielo', 'hielo'],
  category: 'economy',
  run: async ({ msg }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.sender

    const txt = `「🧊」 *LEY DE HIELO ACTIVADA*\n\nNadie le hablará a @${who.split('@')[0]} por 10 minutos\n*Razón:* Se lo ganó 🥶`

    await msg.reply(txt, { mentions: [who] })
    await msg.react('🧊')
  }
}