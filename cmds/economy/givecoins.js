import db from "#db"

export default {
  command: ['givecoins', 'pay', 'coinsgive'],
  category: 'rpg',
  run: async ({ msg, sock, args }) => {

    try {
    const chatId = msg.chat
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency || 'coins'
    const chatData = await db.getChat(msg.chat)

    if (chatData.adminonly ||!chatData.rpg)
      return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

    const [cantidadInputRaw,...rest] = args
    const mentioned = msg.mentionedJid || []
    const who = mentioned[0] || args.find(arg => arg.includes('@s.whatsapp.net'))

    if (!who) return sock.sendMessage(msg.chat, { text: `《✤》 Debes mencionar a quien quieras transferir *${monedas}*.` }, { quoted: msg })

    const senderData = await db.getChatUser(msg.chat, msg.sender)
    const targetData = await db.getChatUser(msg.chat, who)

    if (!targetData) return sock.sendMessage(msg.chat, { text: `「✿」 El usuario mencionado no está registrado en el bot.` }, { quoted: msg })

    const cantidadInput = cantidadInputRaw?.toLowerCase()
    const cantidad = cantidadInput === 'all'
     ? senderData.coins
      : parseInt(cantidadInput)

    if (!cantidadInput || isNaN(cantidad) || cantidad <= 0)
      return sock.sendMessage(msg.chat, { text: `ꕥ Ingresa una cantidad válida de *${monedas}* para transferir.` }, { quoted: msg })

    if (senderData.coins < cantidad)
      return sock.sendMessage(msg.chat, { text: `ꕥ No tienes suficientes *${monedas}* para transferir ${cantidad}.` }, { quoted: msg })

    senderData.coins -= cantidad
    targetData.coins += cantidad

   await db.updateChatUser(msg.chat, msg.sender, 'coins', senderData.coins)
   await db.updateChatUser(msg.chat, who, 'coins', targetData.coins)

      const cantidadFormatted = cantidad.toLocaleString()
      const textoTransferencia = `*¥${cantidadFormatted} ${monedas}*`

    await sock.sendMessage(
      chatId,
      {
        text: `「✿」 Transferiste ${textoTransferencia} a *@${who.split('@')[0]}*.`,
        mentions: [who]
      },
      { quoted: msg }
    )
    } catch (e) {
      await sock.sendMessage(msg.chat, { text: msgglobal + e }, { quoted: msg })
    }
  }
};