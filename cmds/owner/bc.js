import fs from 'fs'
import path from 'path'

export default {
  command: ['bc', 'broadcast'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return sock.sendMessage(msg.chat, { text: `❌ *Uso:*.bc <mensaje>\n*Ejemplo:*.bc Hola a todos` }, { quoted: msg })

    let groups = await sock.groupFetchAllParticipating()
    let gc = Object.keys(groups)
    
    await sock.sendMessage(msg.chat, { text: `「✦」Enviando a *${gc.length}* grupos...` }, { quoted: msg })

    let enviados = 0
    for (let id of gc) {
      await sock.sendMessage(id, { 
        text: `${text}` 
      }).catch(() => {})
      enviados++
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    sock.sendMessage(msg.chat, { text: `✅ *Listo* \nEnviado a *${enviados}* grupos` }, { quoted: msg })
  }
}