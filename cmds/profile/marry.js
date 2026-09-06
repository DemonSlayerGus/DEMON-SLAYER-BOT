import db from "#db"

let proposals = {} // {proposer: proposee}

export default {
  command: ['marry', 'casar'],
  category: 'profile',
  desc: 'Proponer matrimonio a alguien',
  uso: '.marry @mencion',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const proposer = msg.sender
    const mentioned = msg.mentionedJid || []
    const proposee = mentioned[0] || (msg.quoted? msg.quoted.sender : null)

    if (!proposee) return msg.reply('《✤》 Menciona al usuario al que deseas proponer matrimonio.')
    if (proposer === proposee) return msg.reply('「✿」 No puedes proponerte matrimonio a ti mismo.')

    const proposerData = await db.getUser(proposer) || {}
    const proposeeData = await db.getUser(proposee) || {}

    // Revisar si ya están casados
    if (proposerData.marry) {
      const spouse = await db.getUser(proposerData.marry)
      return msg.reply(`✐ Ya estás casado con *${spouse?.name || proposerData.marry.split('@')[0]}*.`)
    }
    if (proposeeData.marry) {
      const spouse = await db.getUser(proposeeData.marry)
      return msg.reply(`✎ *${proposeeData.name || proposee.split('@')[0]}* ya está casado con *${spouse?.name || proposeeData.marry.split('@')[0]}*.`)
    }

    // Si el otro ya te propuso, se casan
    if (proposals[proposee] === proposer) {
      delete proposals[proposee]
      delete proposals[proposer]

      proposerData.marry = proposee
      proposeeData.marry = proposer

      await db.updateUser(proposer, 'marry', proposee)
      await db.updateUser(proposee, 'marry', proposer)

      return msg.reply(
`✐ 💍 ¡FELICIDADES! 💍
*${proposerData.name || proposer.split('@')[0]}* y *${proposeeData.name || proposee.split('@')[0]}*
ahora están casados.`,
        { mentions: [proposer, proposee] }
      )
    }

    // Nueva propuesta
    proposals[proposer] = proposee

    // Expira en 2 minutos
    setTimeout(() => {
      if (proposals[proposer] === proposee) delete proposals[proposer]
    }, 120000)

    return sock.sendMessage(chatId, {
      text: `✎ @${proposee.split('@')[0]}, el usuario @${proposer.split('@')[0]} te ha enviado una propuesta de matrimonio.\n\n⚘ *Responde con:*\n> ❀ *_marry @${proposer.split('@')[0]}_* para aceptar.\n> ❀ La propuesta expirará en 2 minutos.`,
      mentions: [proposer, proposee]
    }, { quoted: msg })
  }
}