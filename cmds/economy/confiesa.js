const preguntas = [
  "¿A quién le tienes ganas del grupo?",
  "¿Cuál es tu secreto más turbio?",
  "¿Has stalkeado a tu ex esta semana?",
  "¿Cuánto es lo máximo que has mentido?",
  "¿Te gusta alguien aquí? Confiesa 👀"
]

export default {
  command: ['confiesa'],
  category: 'economy',
  run: async ({ msg }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.sender
    let pregunta = preguntas[Math.floor(Math.random() * preguntas.length)]

    const txt = `「😈」 *CONFIESA O CASTIGO*\n\n@${who.split('@')[0]}\n\n> ${pregunta}\n\nTienes 10 seg para responder`

    await msg.reply(txt, { mentions: [who] })
    await msg.react('🫣')
  }
}