import db from "#db"

export default {
  command: ['dar', 'pay'],
  category: 'economy',
  run: async ({ msg, sock, args }) => {
    if (!db.data) db.data = {}
    if (!db.data.users) db.data.users = {}

    let target = msg.mentionedJid?.[0]
    let monto = parseInt(args[1])

    if (!target) return sock.sendMessage(msg.chat, { text: '❌ Menciona a quien darle\n.ej:.dar @usuario 500' }, { quoted: msg })
    if (!monto || monto < 1) return sock.sendMessage(msg.chat, { text: '❌ Pon un monto válido' }, { quoted: msg })

    if (!db.data.users[msg.sender]) db.data.users[msg.sender] = { money: 1000 }
    if (!db.data.users[target]) db.data.users[target] = { money: 1000 }

    if (db.data.users[msg.sender].money < monto) return sock.sendMessage(msg.chat, { text: '❌ No tienes tanto dinero' }, { quoted: msg })

    db.data.users[msg.sender].money -= monto
    db.data.users[target].money += monto

    sock.sendMessage(msg.chat, { text: `💸 *TRANSFERENCIA*\n\nDiste: $${monto}\nTu saldo: $${db.data.users[msg.sender].money}` }, { quoted: msg })
  }
}