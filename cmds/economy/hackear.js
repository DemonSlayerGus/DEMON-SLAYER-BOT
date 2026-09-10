import db from "#db"

export default {
  command: ['hackear', 'hacerhack'],
  alias: ['/hack', '/hackear'],
  category: 'economia',
  desc: 'Intenta adivinar la contraseña y robar moras',
  uso: '@usuario <numero>',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const atacante = await db.getChatUser(chatId, msg.sender)
    const target = msg.mentionedJid?.[0] || msg.quoted?.sender
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    if (!target || target === msg.sender)
      return sock.sendMessage(chatId, { text: '「✦」Menciona a alguien válido' }, { quoted: msg })

    const victima = await db.getChatUser(chatId, target)
    if (!victima || (victima.coins || 0) < 50)
      return sock.sendMessage(chatId, { text: '「✦」La víctima no tiene suficientes moras' }, { quoted: msg })

    const contraseña = Math.floor(Math.random() * 900 + 100)
    const intento = parseInt(args[1])

    if (!intento)
      return sock.sendMessage(chatId, { text: `「✦」Escribe: .hackear @usuario <numero de 3 dígitos>\nContraseña secreta: ***` }, { quoted: msg })

    if (intento === contraseña) {
      const robo = Math.floor((victima.coins || 0) * 0.15)
      victima.coins -= robo
      atacante.coins = (atacante.coins || 0) + robo
      await db.updateChatUser(chatId, target, 'coins', victima.coins)
      await db.updateChatUser(chatId, msg.sender, 'coins', atacante.coins)
      return sock.sendMessage(chatId, { text: `✅ ¡CONTRASEÑA DESCIFRADA!\nRobaste ¥${robo.toLocaleString()} ${monedas} 💰` }, { quoted: msg })
    } else {
      const multa = 30
      atacante.coins = Math.max(0, (atacante.coins || 0) - multa)
      await db.updateChatUser(chatId, msg.sender, 'coins', atacante.coins)
      return sock.sendMessage(chatId, { text: `❌ Fallaste. La contraseña era ${contraseña}.\nTe multaron con ¥${multa} ${monedas} por hacker novato 🚔` }, { quoted: msg })
    }
  }
}
