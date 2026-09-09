const respuestas = [
  "A ver bro, explícate mejor que no te entendí ni con dibujos 😅",
  "Ya ps, dime qué quieres y te ayudo. Pero sin roche",
  "Estoy más perdido que tú en lunes 7am. Repite",
  "Eso que me dijiste suena a tarea. No hago tareas",
  "Basta pe, me caes bien pero no me jodas tanto 😂"
]

export default {
  command: ['simi', 'bot'],
  category: 'fun',
  run: async ({ msg, args }) => {
    const text = args.join(' ')
    if (!text) return msg.reply(`*Ejemplo:*.simi hola`)

    const random = respuestas[Math.floor(Math.random() * respuestas.length)]
    const txt = `「🤖」 *SimiBot*\n\n> ${text}\n\n${random}`

    await msg.reply(txt)
    await msg.react('💬')
  }
}