import fs from 'fs'
import { exec } from 'child_process'

export default {
  command: ['gitpush', 'push', 'gp'],
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.sendMessage(msg.chat, { text: '⏳ Subiendo cambios a Github... espera 30s' }, { quoted: msg })

    // Gitignore élite para no subir nada delicado
    const ignoreContent = `# Dependencias
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Sesiones Baileys - CRÍTICO
auth_info_baileys/
auth_info/
baileys_auth_info/
Sessions/
session/
sessions/
*.session

# Base de datos
database/
database.json
*.db
*.sqlite
*.sqlite3

# Entorno y privados
.env
.env.*
*.pem

# Logs y basura
npm-debug.log*
logs/
tmp/
temp/
.DS_Store
`

    fs.writeFileSync('.gitignore', ignoreContent)

    const cmd = `
      git config user.email "bot@whatsapp.local" && 
      git config user.name "WhatsApp Bot" && 
      git rm -r --cached auth_info_baileys Sessions session auth_info baileys_auth_info database database.json .env 2>/dev/null || true &&
      git add . && 
      git commit -m "update desde whatsapp" || echo "sin cambios" && 
      git push origin main
    `

    exec(cmd, { timeout: 60000 }, async (error, stdout, stderr) => {
      let res = ''
      if (error && !stdout) {
        res = `❌ *Error:*\n\`\`${error.message}\`\``
      } else if (stdout.includes('Everything up-to-date') || stdout.includes('sin cambios')) {
        res = 'ꕥ *Estado:* No hay cambios nuevos'
      } else {
        res = `✅ *Listo, push limpio sin sesión*\n\n\`\`${(stdout || stderr).slice(0, 1500)}\`\``
      }
      await sock.sendMessage(msg.chat, { text: res }, { quoted: msg })
    })
  }
  }
