import fs from 'fs'
import path from 'path'

export default {
  command: ['delfile', 'borrar'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return msg.reply(`❌ *Uso:*.delfile ruta/archivo.js`)
    fs.unlinkSync(path.join('./', text))
    msg.reply(`✅ Archivo *${text}* eliminado`)
  }
}