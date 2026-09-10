import db from "#db"

export default {
  command: ['pagar', 'pagardeuda'],
  alias: ['/pagar'],
  category: 'economia',
  desc: 'Paga tu deuda del préstamo',
  uso: '<cantidad>',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const user = await db.getChatUser(chatId, msg.sender)
    const monto = parseInt(args[0])

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    if (!user.deuda || user.deuda <= 0)
      return sock.sendMessage(chatId, { text: '「✦」No tienes deudas pendientes' }, { quoted: msg })

    if (!monto || monto < 1)
      return sock.sendMessage(chatId, { text: `「✦」Tu deuda es de ¥${user.deuda} moras` }, { quoted: msg })

    if ((user.coins || 0) < monto)
      return sock.sendMessage(chatId, { text: '「✦」No tienes suficientes moras para pagar' }, { quoted: msg })

    user.coins -= monto
    user.deuda = Math.max(0, user.deuda - monto)
    await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)
    await db.updateChatUser(chatId, msg.sender, 'deuda', user.deuda)

    return sock.sendMessage(chatId, {
      text: `💳 Pago: ¥${monto} moras\nDeuda restante: ${user.deuda > 0 ? `¥${user.deuda}` : '¡Ninguna, libre de deudas!'}`
    }, { quoted: msg })
  }
}