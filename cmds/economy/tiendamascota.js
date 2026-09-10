import db from "#db"

const TIENDA = [
  { id: 1, nombre: 'Comida Premium', emoji: '🥩', precio: 25, efecto: 'hambre', valor: 50, desc: 'Rellena mucha hambre' },
  { id: 2, nombre: 'Galletas', emoji: '🍪', precio: 15, efecto: 'hambre', valor: 25, desc: 'Un snack rico' },
  { id: 3, nombre: 'Juguete', emoji: '🧸', precio: 30, efecto: 'felicidad', valor: 40, desc: 'Se divierte mucho' },
  { id: 4, nombre: 'Cepillado', emoji: '✨', precio: 20, efecto: 'felicidad', valor: 25, desc: 'Queda hermoso' },
  { id: 5, nombre: 'Vitaminas', emoji: '💊', precio: 35, efecto: 'salud', valor: 45, desc: 'Recupera salud' },
  { id: 6, nombre: 'Correa y paseo', emoji: '🏃', precio: 40, efecto: 'todo', valor: 15, desc: 'Sube todo un poco' }
]

export default {
  command: ['tiendamascota', 'tiendamascotas', 'compraritem'],
  alias: ['/tienda', '/tiendamascota', '/compraritem'],
  category: 'economia',
  desc: 'Compra artículos para tu mascota',
  uso: '[lista/comprar <numero>]',
  run: async ({ msg, sock, args }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const user = await db.getChatUser(chatId, msg.sender)
    const accion = args[0]?.toLowerCase()
    const num = parseInt(args[1])

    if (chat.adminonly || !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    // 📋 Ver tienda
    if (!accion || accion === 'lista' || accion === 'ver') {
      let lista = '🏪 *TIENDA DE MASCOTAS*\n\n'
      TIENDA.forEach(item => {
        lista += `${item.id}. ${item.emoji} ${item.nombre} — ¥${item.precio}\n   ${item.desc}\n`
      })
      lista += '\n> Comprar: .tiendamascota comprar <numero>'
      return sock.sendMessage(chatId, { text: lista }, { quoted: msg })
    }

    // ⚠️ Sin mascota
    if (!user.mascota) {
      return sock.sendMessage(chatId, { 
        text: '「✦」Necesitas una mascota primero.\nCompra una con .comprarmascota' 
      }, { quoted: msg })
    }

    // 🛒 Comprar artículo
    if (accion === 'comprar' && num) {
      const item = TIENDA.find(i => i.id === num)
      if (!item) return sock.sendMessage(chatId, { text: '「✦」Artículo no encontrado' }, { quoted: msg })

      if ((user.coins || 0) < item.precio) {
        return sock.sendMessage(chatId, { text: `「✦」Necesitas ¥${item.precio} moras para comprar ${item.nombre}` }, { quoted: msg })
      }

      user.coins -= item.precio
      user.mascota.cuidados++

      if (item.efecto === 'hambre') {
        user.mascota.hambre = Math.min(100, user.mascota.hambre + item.valor)
      } else if (item.efecto === 'felicidad') {
        user.mascota.felicidad = Math.min(100, user.mascota.felicidad + item.valor)
      } else if (item.efecto === 'salud') {
        user.mascota.salud = Math.min(100, user.mascota.salud + item.valor)
      } else if (item.efecto === 'todo') {
        user.mascota.hambre = Math.min(100, user.mascota.hambre + item.valor)
        user.mascota.felicidad = Math.min(100, user.mascota.felicidad + item.valor)
        user.mascota.salud = Math.min(100, user.mascota.salud + item.valor)
      }

      await db.updateChatUser(chatId, msg.sender, 'coins', user.coins)
      await db.updateChatUser(chatId, msg.sender, 'mascota', user.mascota)

      return sock.sendMessage(chatId, { 
        text: `🛒 Compraste: ${item.emoji} ${item.nombre}\n¡Tu mascota está más feliz! 🥰` 
      }, { quoted: msg })
    }

    return sock.sendMessage(chatId, { text: '「✦」Uso: .tiendamascota comprar <numero>' }, { quoted: msg })
  }
}
