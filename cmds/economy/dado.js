import db from "#db"

export default {
  command: ['dado'],
  category: 'economy',
  run: async ({ msg, sock, args }) => {
    if (!db.data) db.data = {}
    if (!db.data.users) db.data.users = {}

    if (!db.data.users[msg.sender]) db.data.users[msg.sender] = { money: 1000 }
    let user = db.data.users[msg.sender]

    let apuesta = parseInt(args[0])
    if (!apuesta || apuesta < 50) return sock.sendMessage(msg.chat, { text: '❌ Apuesta mínimo $50\nEjemplo:.dado 200' }, { quoted: msg })
    if (user.money < apuesta) return sock.sendMessage(msg.chat, { text: `❌ No tienes $${apuesta}\nTu saldo: $${user.money}` }, { quoted: msg })

    let tuDado = Math.floor(Math.random() * 6) + 1
    let botDado = Math.floor(Math.random() * 6) + 1

    let texto = `🎲 *JUEGO DE DADOS*\n\nTú: ${tuDado} 🎲\nBot: ${botDado} 🎲\n\n`

    if (tuDado > botDado) {
      user.money += apuesta
      texto += `✅ GANASTE!\nGanancia: +$${apuesta}`
    } else if (tuDado < botDado) {
      user.money -= apuesta
      texto += `❌ PERDISTE!\nPérdida: -$${apuesta}`
    } else {
      texto += `😐 EMPATE!\nNo pierdes ni ganas`
    }

    texto += `\nSaldo: $${user.money}`

    sock.sendMessage(msg.chat, { text: texto }, { quoted: msg })
  }
}