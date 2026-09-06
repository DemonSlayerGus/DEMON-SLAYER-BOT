import db from "#db"
export default {
  command: ['ppt'],
  category: 'rpg',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    const chatId = msg.chat
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency
    const chatData = await db.getChat(msg.chat)

    if (chatData.adminonly ||!chatData.rpg)
      return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

    const user = await db.getChatUser(msg.chat, msg.sender)
    const user2 = await db.getUser(msg.sender)
    const remainingTime = user.pptCooldown - Date.now()

    if (remainingTime > 0)
      return sock.sendMessage(msg.chat, { text: `❀ Debes esperar *${msToTime(remainingTime)}* antes de jugar nuevamente.` }, { quoted: msg })

    const options = ['piedra', 'papel', 'tijera']
    const userChoice = args[0]?.trim().toLowerCase()

    if (!options.includes(userChoice))
      return sock.sendMessage(msg.chat, { text: `《✤》 Usa el comando así:\n› *${prefix + command} piedra*, *papel* o *tijera*` }, { quoted: msg })

    const botChoice = options[Math.floor(Math.random() * options.length)]
    const result = determineWinner(userChoice, botChoice)

    const reward = Math.floor(Math.random() * 3000)
    const exp = Math.floor(Math.random() * 1000)
    const loss = Math.floor(Math.random() * 1000)
    const tieReward = Math.floor(Math.random() * 100)
    const tieExp = Math.floor(Math.random() * 100)

    if (result === 'win') {
      user.coins += reward
      user2.exp += exp

   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
   await db.updateUser(msg.sender, 'exp', user2.exp)

      await sock.sendMessage(
        chatId,
        { text: `✿ Ganaste.\n\n> *Tu elección ›* ${userChoice}\n> *Bot eligió ›* ${botChoice}\n> *${monedas} ›* ¥${reward.toLocaleString()}\n> *Exp ›* ${exp}\n\n${dev}` },
        { quoted: msg }
      )
    } else if (result === 'lose') {
      const total = user.coins + user.bank
      const actualLoss = Math.min(loss, total)

      if (user.coins >= actualLoss) {
        user.coins -= actualLoss

   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
      } else {
        const remaining = actualLoss - user.coins
        user.coins = 0
        user.bank = Math.max(0, user.bank - remaining)

   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
   await db.updateChatUser(msg.chat, msg.sender, 'bank', user.bank)
      }

      await sock.sendMessage(
        chatId,
        { text: `✿ Perdiste.\n\n> *Tu elección ›* ${userChoice}\n> *Bot eligió ›* ${botChoice}\n> *${monedas} ›* -¥${actualLoss.toLocaleString()}\n\n${dev}` },
        { quoted: msg }
      )
    } else {
      user.coins += tieReward
      user2.exp += tieExp

   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
   await db.updateUser(msg.sender, 'exp', user2.exp)
      await sock.sendMessage(
        chatId,
        { text: `✿ Empate.\n\n> *Tu elección ›* ${userChoice}\n> *Bot eligió ›* ${botChoice}\n> *${monedas} ›* +¥${tieReward.toLocaleString()}\n> *Exp ›* +${tieExp}\n\n${dev}` },
        { quoted: msg }
      )
    }

    user.pptCooldown = Date.now() + 10 * 60 * 1000 // 10 minutos
   await db.updateChatUser(msg.chat, msg.sender, 'pptCooldown', user.pptCooldown)
  },
}

function determineWinner(user, bot) {
  if (user === bot) return 'tie'
  if (
    (user === 'piedra' && bot === 'tijera') ||
    (user === 'papel' && bot === 'piedra') ||
    (user === 'tijera' && bot === 'papel')
  )
    return 'win'
  return 'lose'
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)

  return `${minutes} minuto${minutes!== 1? 's' : ''}, ${seconds} segundo${seconds!== 1? 's' : ''}`
}