import db from "#db"

export default {
  command: ['rankingmascotas', 'topmascotas', 'mejorescuidador'],
  alias: ['/topmascotas', '/rankingmascotas', '/mejorescuidador'],
  category: 'economia',
  desc: 'Tabla de quién cuida mejor a su mascota',
  uso: '',
  run: async ({ msg, sock }) => {
    const chatId = msg.chat
    const chat = await db.getChat(chatId)
    const metadata = await sock.groupMetadata(chatId)
    const participantes = metadata.participants

    if (!metadata) return msg.reply('「✦」Este comando solo funciona en grupos')
    if (chat.adminonly && !chat.rpg)
      return sock.sendMessage(chatId, { text: mess.comandooff }, { quoted: msg })

    const ranking = []
    for (const p of participantes) {
      const user = await db.getChatUser(chatId, p.id)
      if (user && user.mascota && user.mascota.cuidados > 0) {
        ranking.push({
          nombre: user.mascota.nombre,
          emoji: user.mascota.emoji,
          dueño: p.subject || user.name || p.id.split('@')[0],
          cuidados: user.mascota.cuidados,
          saludTotal: user.mascota.hambre + user.mascota.felicidad + user.mascota.salud
        })
      }
    }

    if (!ranking.length) {
      return sock.sendMessage(chatId, { 
        text: '「✦」Aún no hay mascotas en el grupo.\n¡Sé el primero en adoptar una con .comprarmascota!' 
      }, { quoted: msg })
    }

    ranking.sort((a, b) => b.cuidados - a.cuidados)

    let tabla = '🏆 *RANKING DE CUIDADO DE MASCOTAS* 🏆\n\n'
    tabla += 'Pos | Mascota | Dueño | Cuidados\n'
    tabla += '----|---------|-------|---------\n'

    ranking.slice(0, 10).forEach((pos, i) => {
      const med = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
      tabla += `${med} | ${pos.emoji} ${pos.nombre} | ${pos.dueño.slice(0, 8)} | ${pos.cuidados}\n`
    })

    tabla += '\n📊 Según cantidad de cuidados recibidos'
    await sock.sendMessage(chatId, { text: tabla }, { quoted: msg })
  }
}
