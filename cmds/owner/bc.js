import fs from 'fs'
import path from 'path'

export default {
  command: ['bc', 'broadcast'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return sock.sendMessage(msg.chat, { text: `❌ *Uso:* .bc <mensaje>\n*Ejemplo:* .bc Mantenimiento en 5 minutos` }, { quoted: msg })

    let groups = await sock.groupFetchAllParticipating()
    let gc = Object.keys(groups)
    
    await sock.sendMessage(msg.chat, { text: `「✦」Enviando broadcast a *${gc.length}* grupos...` }, { quoted: msg })

    let enviados = 0
    for (let id of gc) {
      await sock.sendMessage(id, { 
        text: `「✦」*BROADCAST*\n\n${text}\n\n_${new Date().toLocaleString('es-CO', {timeZone: 'America/Bogota'})}_` 
      }).catch(() => {})
      enviados++
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    sock.sendMessage(msg.chat, { text: `✅ *Listo* \nBroadcast enviado a *${enviados}* grupos` }, { quoted: msg })
  }
}