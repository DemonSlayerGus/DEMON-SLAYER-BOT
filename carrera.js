import db from "#db"

const CORREDORES = [
  { nombre: 'Tortuga Hiperactiva', emoji: '🐢', velocidad: 8 },
  { nombre: 'Caracol con Nitro', emoji: '🐌', velocidad: 6 },
  { nombre: 'Pato en Monopatín', emoji: '🦆', velocidad: 7 },
  { nombre: 'Pizza en Patines', emoji: '🍕', velocidad: 9 }
]

export default {
  command: ['carrera', 'apostar'],
  alias: ['/carrera', '/apuesta'],
  category: 'rpg',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const user = await db.getChatUser(chatId, msg.sender)
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    const [eleccion, cantidadStr] = args
    const monto = parseInt(cantidadStr)

    if (!eleccion || !monto)
      return sock.sendMessage(chatId, { text: '「✦」Uso: .carrera <numero> <cantidad>\n1: Tortuga 🐢\n2: Caracol 🐌\n3: Pato 🦆\n4: Pizza 🍕' }, { quoted: msg })

    if (monto < 10)
      return sock.sendMessage(chatId, { text: '「✦」Mínimo 10 moras' }, { quoted: msg })

    if ((user.coins || 0) < monto)
      return sock.sendMessage(chatId, { text: '「✦」No tienes suficientes moras' }, { quoted: msg })

    const idx = parseInt(eleccion) - 1
    if (idx < 0 || idx > 3)
      return sock.sendMessage(chatId, { text: '「✦」Elige 1, 2, 3 o 4' }, { quoted: msg })

    // Restar apuesta
    user.coins -= monto
    await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)

    // Simular carrera
    const ganador = CORREDORES[Math.floor(Math.random() * CORREDORES.length)]
    const ganaIdx = CORREDORES.indexOf(ganador)

    if (idx === ganaIdx) {
      user.coins += monto * 2
      await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)
      await sock.sendMessage(chatId, { text: `🎉 ¡GANASTE!\nEl ganador fue: ${ganador.emoji} ${ganador.nombre}\nTe llevas ¥${(monto * 2).toLocaleString()} ${monedas} 💰` }, { quoted: msg })
    } else {
      await sock.sendMessage(chatId, { text: `😢 Perdiste\nGanó: ${ganador.emoji} ${ganador.nombre}\nSe te descontaron ¥${monto.toLocaleString()} ${monedas}` }, { quoted: msg })
    }
  }
}
