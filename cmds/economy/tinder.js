import db from "#db"

const RESULTADOS = [
  { texto: '¡Cita perfecta! Te regalaron un anillo de diamantes 💍', ganancia: 150 },
  { texto: 'Cita bonita, invitaron helado 🍦', ganancia: 40 },
  { texto: 'Se confundió de persona y nunca llegó 💔', ganancia: -20 },
  { texto: 'Pidió que pagues todo y te dejó sin un centavo 💸', ganancia: -50 },
  { texto: '¡Match de ensueño! Te dieron una fortuna 💰', ganancia: 300 }
]

export default {
  command: ['tinder', 'cita'],
  alias: ['/tinder', '/cita'],
  category: 'economia',
  desc: 'Paga para tener una cita a ciegas',
  uso: '',
  run: async ({ msg, sock }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const user = await db.getChatUser(chatId, msg.sender)
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency
    const costo = 25

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    if ((user.coins || 0) < costo)
      return sock.sendMessage(chatId, { text: `「✦」Necesitas al menos ¥${costo} ${monedas} para una cita` }, { quoted: msg })

    user.coins -= costo
    const res = RESULTADOS[Math.floor(Math.random() * RESULTADOS.length)]
    user.coins = Math.max(0, (user.coins || 0) + res.ganancia)
    await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)

    return sock.sendMessage(chatId, {
      text: `💘 *CITA A CIEGAS*\n\n${res.texto}\n\n${res.ganancia >= 0 ? `+¥${res.ganancia}` : `¥${res.ganancia}`} ${monedas}\nSaldo: ¥${user.coins.toLocaleString()}`
    }, { quoted: msg })
  }
}