import db from "#db"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['gitpush', 'push'],
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Subiendo cambios a Github... Espera 15s' }, { quoted: msg })
    
    exec('git add . && git commit -m "update desde whatsapp" && git push origin main', async (error, stdout, stderr) => {

      let msg2 = ''
      if (error) {
        msg2 = `❌ *Error al subir:*\n${error.message}`
      } else if (stderr && stderr.includes('rejected')) {
        msg2 = `⚠️ *Conflicto:* Primero usa .update para bajar los cambios\n\n${stderr}`
      } else if (stdout.includes('Everything up-to-date')) {
        msg2 = 'ꕥ *Estado:* No hay cambios nuevos para subir'
      } else {
        msg2 = `✅ *Subido a Github correctamente*\n\n${stdout}`
      }

      await sock.sendMessage(msg.key.remoteJid, { text: msg2 }, { quoted: msg })
    })
  }
}