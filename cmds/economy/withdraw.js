import db from "#db"
export default {
  command: ['withdraw', 'with'],
  category: 'rpg',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const senderId = msg.sender
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const chatData = await db.getChat(msg.chat)

    if (chatData.adminonly ||!chatData.rpg)
      return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

    const user = await db.getChatUser(msg.chat, msg.sender)
    const currency = botSettings.currency || 'Monedas'

    if (!args[0]) return sock.sendMessage(msg.chat, { text: `《✤》 Ingresa la cantidad de *${currency}* que quieras retirar.` }, { quoted: msg })

    if (args[0].toLowerCase() === 'all') {
      if ((user.bank || 0) <= 0)
        return sock.sendMessage(msg.chat, { text: `✐ No tienes *${currency}* para retirar de tu Banco.` }, { quoted: msg })

      const amount = user.bank
      user.bank = 0
      user.coins = (user.coins || 0) + amount

   await db.updateChatUser(msg.chat, msg.sender, 'bank', user.bank)
   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)

      return sock.sendMessage(msg.chat, { text: `✐ Has retirado *¥${amount.toLocaleString()} ${currency}* de tu Banco.` }, { quoted: msg })
    }

    const count = parseInt(args[0])
    if (isNaN(count) || count < 1) return sock.sendMessage(msg.chat, { text: `✎ Ingresa una cantidad válida para retirar.` }, { quoted: msg })

    if ((user.bank || 0) < count)
      return sock.sendMessage(msg.chat, { text: `✐ No tienes suficientes *${currency}* en tu banco para retirar esa cantidad.` }, { quoted: msg })

    user.bank -= count
    user.coins = (user.coins || 0) + count

   await db.updateChatUser(msg.chat, msg.sender, 'bank', user.bank)
   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)

    await sock.sendMessage(msg.chat, { text: `✐ Has retirado *¥${count.toLocaleString()} ${currency}* de tu Banco.` }, { quoted: msg })
  },
};