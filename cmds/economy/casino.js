import db from "#db"

const initDB = () => {
  if (!db.data) db.data = {}
  if (!db.data.users) db.data.users = {}
}

export default {
  command: ['casino', 'apostar'],
  category: 'economia',
  run: async ({ msg, sock, args }) => {
    initDB()
    if (!db.data.users[msg.sender]) db.data.users[msg.sender] = { money: 1000 }
    let user = db.data.users[msg.sender]

    if (!args[0]) return sock.sendMessage(msg.chat, { text: `🎰 *CASINO* 🎰

Uso:.casino <monto>
Tu saldo: $${user.money}

💀 40% Pierdes
🔥 35% Ganas x1.5
💰 20% Ganas x2
👑 5% Ganas x5` }, { quoted: msg })

    let monto = parseInt(args[0])
    if (isNaN(monto)) return sock.sendMessage(msg.chat, { text: '❌ Mete un número válido' }, { quoted: msg })
    if (monto < 100) return sock.sendMessage(msg.chat, { text: '❌ Apuesta mínima: $100' }, { quoted: msg })
    if (monto > user.money) return sock.sendMessage(msg.chat, { text: '❌ No tienes tanto. Tu saldo: $' + user.money }, { quoted: msg })

    let res = Math.random()
    let texto = ''

    if (res < 0.4) {
      user.money -= monto
      texto = `💀 *PERDISTE* 💀

Apostaste: $${monto}
Perdiste: $${monto}
Saldo: $${user.money}`
    } else if (res < 0.75) {
      let ganancia = Math.floor(monto * 1.5)
      user.money += ganancia
      texto = `🔥 *GANASTE x1.5* 🔥

Apostaste: $${monto}
Ganaste: $${ganancia}
Saldo: $${user.money}`
    } else if (res < 0.95) {
      let ganancia = monto * 2
      user.money += ganancia
      texto = `💰 *JACKPOT x2* 💰

Apostaste: $${monto}
Ganaste: $${ganancia}
Saldo: $${user.money}`
    } else {
      let ganancia = monto * 5
      user.money += ganancia
      texto = `👑 *MEGA JACKPOT x5* 👑

Apostaste: $${monto}
Ganaste: $${ganancia}
Saldo: $${user.money}`
    }

    sock.sendMessage(msg.chat, { text: texto }, { quoted: msg })
  }
}