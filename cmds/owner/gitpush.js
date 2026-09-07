import fs from 'fs'
import { exec } from 'child_process'

export default {
  command: ['gitpush', 'push', 'gp'],
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.sendMessage(msg.chat, { text: '⏳ Subiendo cambios a Github... espera 30s' }, { quoted: msg })

    // Crear gitignore para no subir sesiones
    const ignore = `Sessions/
database.json
node_modules/
`
    fs.writeFileSync('.gitignore', ignore)

    const cmd = `git config user.email "bot@whatsapp.local" && git config user.name "WhatsApp Bot" && git add . && git commit -m "update desde whatsapp" || echo "sin cambios" && git push origin main`

    exec(cmd, { timeout: 60000 }, async (error, stdout, stderr) => {
      let res = ''
      if (error && !stdout) {
        res = `❌ *Error:*\n\`\`${error.message}\`\``
      } else if (stdout.includes('Everything up-to-date')) {
        res = 'ꕥ *Estado:* No hay cambios nuevos'
      } else {
        res = `✅ *Listo*\n\n\`\`${stdout || stderr}\`\`\``
      }
      await sock.sendMessage(msg.chat, { text: res }, { quoted: msg })
    })
  }
}