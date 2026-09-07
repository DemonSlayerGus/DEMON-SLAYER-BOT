import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['gitpush', 'push', 'gp'],
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Subiendo cambios a Github... 20s' }, { quoted: msg })

    // 1. Crear gitignore para no subir sesiones
    const gitignore = `Sessions/
database.json
node_modules/
.env
`
    fs.writeFileSync('.gitignore', gitignore)

    // 2. Poner tu token aquí bro
    const TOKEN = 'ghp_TU_TOKEN_AQUI' // <--- CAMBIA ESTO
    const USER = 'error404' // <--- TU USUARIO DE GITHUB
    const REPO = 'TU_REPO' // <--- NOMBRE DE TU REPO

    const gitCommand = `git config user.email "bot@whatsapp.local" && git config user.name "WhatsApp Bot" && git remote set-url origin https://${USER}:${TOKEN}@github.com/${USER}/${REPO}.git && git add . && git commit -m "update desde whatsapp $(date)" || true && git push origin main`

    exec(gitCommand, { timeout: 60000 }, async (error, stdout, stderr) => {
      let msg2 = ''
      if (error) {
        msg2 = `❌ *Error al subir:*\n\`\`\`${error.message}\`\`\``
      } else if (stderr && stderr.includes('rejected')) {
        msg2 = `⚠️ *Conflicto:* Primero usa .update para bajar los cambios\n\n\`\`\`${stderr}\`\`\``
      } else if (stdout.includes('Everything up-to-date')) {
        msg2 = 'ꕥ *Estado:* No hay cambios nuevos para subir'
      } else {
        msg2 = `✅ *Subido a Github correctamente*\n\n\`\`\`${stdout}\`\`\``
      }

      await sock.sendMessage(msg.key.remoteJid, { text: msg2 }, { quoted: msg })
    })
  }
}