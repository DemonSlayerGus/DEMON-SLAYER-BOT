import db from "#db"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function reloadCommands(dir = path.join(__dirname, '..')) {
  const commandsMap = new Map()

  async function readCommands(folder) {
    const files = fs.readdirSync(folder)
    for (const file of files) {
      const fullPath = path.join(folder, file)
      if (fs.lstatSync(fullPath).isDirectory()) {
        await readCommands(fullPath)
      } else if (file.endsWith('.js')) {
        try {
          const { default: cmd } = await import(fullPath + '?update=' + Date.now()) // fuerza recarga
          if (cmd?.command) {
            cmd.command.forEach((c) => {
              commandsMap.set(c.toLowerCase(), cmd)
            })
          }
        } catch (err) {
          console.error(`Error recargando comando ${file}:`, err)
        }
      }
    }
  }

  await readCommands(dir)
  global.comandos = commandsMap
}

export default {
  command: ['fix', 'update', 'gitpull'],
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Guardando cambios y actualizando... Espera 20s' }, { quoted: msg })
    
    exec('git stash && git pull && git stash pop', async (error, stdout, stderr) => {
      await reloadCommands(path.join(__dirname, '..'))

      let msg2 = ''
      if (error) {
        msg2 = `❌ *Error:* ${error.message}`
      } else if (stderr && !stderr.includes('Already up to date')) {
        msg2 = `⚠️ *Advertencia:*\n${stderr}\n\n${stdout}`
      } else if (stdout.includes('Already up to date')) {
        msg2 = 'ꕥ *Estado:* Todo está actualizado\nꕥ *Tus cambios:* Seguros'
      } else {
        msg2 = `✅ *Actualización completada*\n\n${stdout}\n\nꕥ *Tus cambios locales se mantuvieron*`
      }

      await sock.sendMessage(msg.key.remoteJid, { text: msg2 }, { quoted: msg })
    })
  }
}