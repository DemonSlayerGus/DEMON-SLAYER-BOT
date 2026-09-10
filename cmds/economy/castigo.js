const castigos = [
  "Lavar los platos 1 semana",
  "Darle $100 a todo el grupo",
  "Cambiar su foto de perfil por una de gato por 3 días",
  "Gritar 'soy noob' en el grupo",
  "Invitar gaseosa a todos"
]

export default {
  command: ['castigo'],
  category: 'economy',
  run: async ({ msg }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.sender
    let castigo = castigos[Math.floor(Math.random() * castigos.length)]

    const txt = `「⚖️」 *CASTIGO IMPUESTO*\n\n@${who.split('@')[0]} debe: \n> ${castigo}\n\nSi no cumple = doble castigo 👹`

    await msg.reply(txt, { mentions: [who] })
    await msg.react('📜')
  }
}