export default {
  command: ['guerra', 'war'],
  category: 'economy',
  run: async ({ msg, conn }) => {
    let who = msg.mentionedJid[0]? msg.mentionedJid[0] : null

    if (!who) return msg.reply(`*Uso:*.guerra @usuario\n\nEjemplo:.guerra @${msg.sender.split('@')[0]}`)

    let atacante = msg.sender
    let victima = who

    const txt = `「💣」 *GUERRA DECLARADA*\n\n@${atacante.split('@')[0]} le declara la guerra a @${victima.split('@')[0]}\n\nQue empiecen los disparos 🔫🔫\n\n*Reglas:* El que pierde paga 500 coins`

    await conn.sendMessage(msg.chat, { text: txt, mentions: [atacante, victima] }, { quoted: msg })
    await msg.react('⚔️')
  }
}