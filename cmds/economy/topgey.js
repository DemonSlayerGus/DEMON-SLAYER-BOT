import fs from 'fs'

export default {
  command: ['topgey', 'topgay'],
  category: 'economy',
  run: async ({ msg, conn, db }) => {

    let users = Object.entries(db.data.users)
     .filter(([id, user]) => user.money > 0) // solo los que tienen plata
     .sort((a, b) => b[1].money - a[1].money) // ordena por dinero
     .slice(0, 10) // top 10

    if (users.length === 0) return msg.reply('「❌」 *NO HAY GAYS EN EL TOP*')

    let texto = `「👑」 *TOP 10 GEYS DEL BOT*\n\n`

    let rank = 1
    for (let [jid, user] of users) {
      let name = await conn.getName(jid)
      texto += `*${rank}.* @${jid.split('@')[0]} - *$${user.money.toLocaleString()}*\n`
      rank++
    }

    texto += `\n*Nota:* Mientras más plata, más gey 😏`

    await conn.sendMessage(msg.chat, {
      text: texto,
      mentions: users.map(([jid]) => jid)
    }, { quoted: msg })

    msg.react('🏳️‍🌈')
  }
}