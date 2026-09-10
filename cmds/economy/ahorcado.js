import db from "#db"

const PALABRAS = ['goku', 'anime', 'bot', 'moras', 'discord', 'whatsapp', 'ninja', 'dragon', 'pizza', 'futbol']
const juegosActivos = new Map()

export default {
  command: ['ahorcado', 'adivina', 'palabra'],
  alias: ['/ahorcado', '/adivina'],
  category: 'economia',
  desc: 'Adivina la palabra y gana moras',
  uso: '[letra o palabra]',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const user = await db.getChatUser(chatId, msg.sender)
    const entrada = args.join('').toLowerCase()
    const premio = 50

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    // Responder a juego activo
    if (juegosActivos.has(chatId) && entrada) {
      const juego = juegosActivos.get(chatId)
      if (entrada === juego.palabra || juego.palabra.includes(entrada)) {
        user.coins = (user.coins || 0) + premio
        await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)
        juegosActivos.delete(chatId)
        return sock.sendMessage(chatId, { text: `🎉 ¡Adivinaste!\nLa palabra era: *${juego.palabra}*\nGanaste ¥${premio} moras 💰` }, { quoted: msg })
      }
      return sock.sendMessage(chatId, { text: '❌ No es esa letra/palabra. Sigue intentando!' }, { quoted: msg })
    }

    // Iniciar juego nuevo
    const palabra = PALABRAS[Math.floor(Math.random() * PALABRAS.length)]
    const oculta = palabra.replace(/./g, '_ ')
    juegosActivos.set(chatId, { palabra })

    return sock.sendMessage(chatId, {
      text: `🔤 *EL AHORCADO*\n\nPalabra: ${oculta}\n\nEscribe una letra o la palabra completa!`,
    }, { quoted: msg })
  }
}
