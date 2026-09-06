import db from "#db"

export default {
  command: ['steal', 'rob', 'robar'],
  category: 'rpg',
  run: async ({ msg, sock }) => {
    try {
      const chatId = msg.chat
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const botSettings = await db.getSettings(botId)
      const monedas = botSettings.currency
      const chatData = await db.getChat(msg.chat)

      if (chatData.adminonly ||!chatData.rpg)
        return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

      const mentioned = msg.mentionedJid || []
      const target = mentioned[0] || (msg.quoted? msg.quoted.sender : null)

      if (!target || target === msg.sender)
        return sock.sendMessage(msg.chat, { text: `《✤》 Debes mencionar a quien quieras robarle *${monedas}*.` }, { quoted: msg })

      const senderData = await db.getChatUser(msg.chat, msg.sender)
      const targetData = await db.getChatUser(msg.chat, target)
      const na = await db.getUser(target)

      if (!targetData) {
        return sock.sendMessage(msg.chat, { text: 'ꕥ El usuario *mencionado* no está *registrado* en el bot' }, { quoted: msg })
      }

      const lastActive = targetData.lastSeen || targetData.lastMessage || targetData.usedTime || 0
      const inactiveTime = Date.now() - lastActive
      const ONE_HOUR_MS = 60 * 60 * 1000

      if (inactiveTime < ONE_HOUR_MS) {
        return sock.sendMessage(msg.chat, { text: `✎ Solo puedes robar a usuarios que lleven al menos *1 hora inactivos*.` }, { quoted: msg })
      }

      if (targetData.coins < 50)
        return sock.sendMessage(msg.chat, { text: `ꕤ *${na.name || target.split('@')[0]}* no tiene suficiente *${monedas}* para robarle.` }, { quoted: msg })

      const remainingTime = senderData.roboCooldown - Date.now()
      if (remainingTime > 0)
        return sock.sendMessage(msg.chat, { text: `ꕥ Debes esperar *${msToTime(remainingTime)}* antes de intentar robar nuevamente.` }, { quoted: msg })

      senderData.roboCooldown = Date.now() + 30 * 60 * 1000 // 30 minutos
      await db.updateChatUser(msg.chat, msg.sender, 'roboCooldown', senderData.roboCooldown)

      const cantidadRobada = Math.min(Math.floor(Math.random() * 5000) + 50, targetData.coins)
      senderData.coins += cantidadRobada
      targetData.coins -= cantidadRobada

      await db.updateChatUser(msg.chat, msg.sender, 'coins', senderData.coins)
      await db.updateChatUser(msg.chat, target, 'coins', targetData.coins)

      await sock.sendMessage(
        chatId,
        {
          text: `✐ Le robaste *¥${cantidadRobada.toLocaleString()} ${monedas}* a *${na.name || target.split('@')[0]}*.`,
          mentions: [target]
        },
        { quoted: msg }
      )

    } catch (e) {
      await sock.sendMessage(msg.chat, { text: msgglobal }, { quoted: msg })
    }
  },
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes} minuto${minutes!== 1? 's' : ''}, ${seconds} segundo${seconds!== 1? 's' : ''}`
}