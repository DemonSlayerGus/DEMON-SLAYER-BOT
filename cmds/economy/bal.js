import db from "#db"

export default {
  command: ['balance', 'bal'],
  category: 'economy',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    const chatData = await db.getChat(msg.chat)
    const botId = sock.user.id.split(':')[0] + "@s.whatsapp.net"
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency || 'moras'

    if (chatData.adminonly ||!chatData.rpg)
      return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

    const mentioned = msg.mentionedJid
    const who = mentioned.length > 0? mentioned[0] : (msg.quoted? msg.quoted.sender : msg.sender)

    const user = await db.getChatUser(msg.chat, who)
    const user2 = await db.getUser(who)
    if (!user)
      return sock.sendMessage(msg.chat, { text: `「✿」 El usuario mencionado no está registrado en el bot.` }, { quoted: msg })

    // ARREGLO: Probamos varios nombres comunes
    const wallet = user.money || user.coins || user.wallet || user.exp || 0
    const bank = user.bank || user.banco || user.diamonds || 0
    const total = wallet + bank

    const bal = `╭─❍「 💰 *BALANCE* 」❍
│
│ 👤 *Usuario:* ${user2.name}
│
│ 💵 *Billetera:* ¥${wallet.toLocaleString()}
│ 🏦 *Banco:* ¥${bank.toLocaleString()}
│
│ 📊 *Total:* ¥${total.toLocaleString()}
│
╰────────────────❍

> 💡 Protege tus ${monedas} con *${prefix}dep*
> 📥 Retira con *${prefix}with*`

    await sock.sendMessage(msg.chat, {
      text: bal,
      mentions: [who]
    }, { quoted: msg })
  }
};