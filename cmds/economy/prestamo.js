import db from "#db"

export default {
  command: ['prestamo', 'pedirprestamo', 'deuda'],
  alias: ['/prestamo', '/pedir', '/deuda'],
  category: 'economia',
  desc: 'Pide moras prestadas con interés',
  uso: '<cantidad>',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const user = await db.getChatUser(chatId, msg.sender)
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency
    const monto = parseInt(args[0])

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    if (!monto || monto < 50)
      return sock.sendMessage(chatId, { text: '「✦」Pide al menos 50 moras' }, { quoted: msg })

    if ((user.deuda || 0) > 0)
      return sock.sendMessage(chatId, { text: `「✦」Tienes una deuda pendiente de ¥${user.deuda} ${monedas}. Paga primero con .pagar` }, { quoted: msg })

    const devolver = Math.floor(monto * 1.4) // 40% de interés
    user.coins = (user.coins || 0) + monto
    user.deuda = devolver
    await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)
    await db.updateChatUser(chatId, msg.sender, 'deuda', user.deuda)

    return sock.sendMessage(chatId, {
      text: `💰 *PRÉSTAMO APROBADO*\n\nRecibes: ¥${monto} ${monedas}\nDebes devolver: ¥${devolver} ${monedas} (40% interés)\n\nPaga con: .pagar <monto>`
    }, { quoted: msg })
  }
}