import fs from 'fs'
import path from 'path'

export default {
  command: ['addcmd', 'cc'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return sock.sendMessage(msg.chat, { text: `❌ *Uso:*.addcmd carpeta|nombre|CODIGO

*Carpetas:* info, dl, search, owner, economy, fun, rpg
*Ejemplo:*
.addcmd economy|dar|import db from "#db"...` }, { quoted: msg })

    let partes = text.split('|')
    if (partes.length < 3) return sock.sendMessage(msg.chat, { text: '❌ Usa: carpeta|nombre|codigo' }, { quoted: msg })

    let carpeta = partes[0].trim().toLowerCase()
    let nombre = partes[1].trim().toLowerCase() + '.js'
    let codigo = partes.slice(2).join('|').trim()

    let folder = `./cmds/${carpeta}/`

    if (!fs.existsSync('./cmds')) fs.mkdirSync('./cmds')
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

    let filePath = path.join(folder, nombre)

    if (fs.existsSync(filePath)) return sock.sendMessage(msg.chat, { text: `❌ Ya existe ${nombre} en ${carpeta}` }, { quoted: msg })

    fs.writeFileSync(filePath, codigo)

    sock.sendMessage(msg.chat, { text: `✅ *Creado:* ${filePath}` }, { quoted: msg })
  }
}