import db from "#db"

const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)

  const pad = (n) => n.toString().padStart(2, '0')
  if (minutes === 0) return `${pad(seconds)} segundo${seconds!== 1? 's' : ''}`
  return `${pad(minutes)} minuto${minutes!== 1? 's' : ''}, ${pad(seconds)} segundo${seconds!== 1? 's' : ''}`
}

export default {
  command: ['rt', 'roulette', 'ruleta'],
  category: 'rpg',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const senderId = msg.sender
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'

    // Obtener configuración del bot y del chat
    const botSettings = await db.getSettings(botId)
    const chatData = await db.getChat(chatId)

    if (chatData.adminonly ||!chatData.rpg)
      return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

    const user = await db.getChatUser(chatId, senderId)
    const cooldown = 5 * 60 * 1000
    const now = Date.now()
    const remaining = (user.rtCooldown || 0) - now
    const currency = botSettings.currency || 'Monedas'

    if (remaining > 0)
      return sock.sendMessage(msg.chat, { text: `🌱 Debes esperar *${msToTime(remaining)}* antes de apostar nuevamente.` }, { quoted: msg })

    if (args.length!== 2)
      return sock.sendMessage(msg.chat, { text: `🌾 Debes ingresar una cantidad de ${currency} y apostar a un color.` }, { quoted: msg })

    const amount = parseInt(args[0])
    const color = args[1].toLowerCase()
    const validColors = ['red', 'black', 'green']

    if (isNaN(amount) || amount < 200)
      return sock.sendMessage(msg.chat, { text: `🌾 La cantidad mínima de ${currency} a apostar es 200.` }, { quoted: msg })

    if (!validColors.includes(color))
      return sock.sendMessage(msg.chat, { text: `🍒 Por favor, elige un color válido: red, black, green.` }, { quoted: msg })

    if (user.coins < amount)
      return sock.sendMessage(msg.chat, { text: `🍒 No tienes suficientes *${currency}* para hacer esta apuesta.` }, { quoted: msg })

    // Actualizar cooldown
    user.rtCooldown = now + cooldown
    await db.updateChatUser(chatId, senderId, 'rtCooldown', user.rtCooldown)

    const resultColor = validColors[Math.floor(Math.random() * validColors.length)]

    if (resultColor === color) {
      const reward = amount * (resultColor === 'green'? 14 : 2)
      user.coins += reward
      await db.updateChatUser(chatId, senderId, 'coins', user.coins)

      await sock.sendMessage(
        chatId,
        {
          text: `🌱 La ruleta salió en *${resultColor}* y has ganado *¥${reward.toLocaleString()} ${currency}*.`,
          mentions: [senderId]
        },
        { quoted: msg }
      )
    } else {
      user.coins -= amount
      await db.updateChatUser(chatId, senderId, 'coins', user.coins)

      await sock.sendMessage(
        chatId,
        {
          text: `🌱 La ruleta salió en *${resultColor}* y has perdido *¥${amount.toLocaleString()} ${currency}*.`,
          mentions: [senderId]
        },
        { quoted: msg }
      )
    }
  },
}