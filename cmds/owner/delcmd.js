import fs from 'fs'
import path from 'path'

export default {
  command: ['delcmd', 'borrarcmd', 'rmcmd'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return sock.sendMessage(msg.chat, { text: `❌ *Uso:*.delcmd carpeta|nombre\n\n*Ejemplo:*.delcmd economy/dado\n*Carpetas:* info, dl, search, owner, economy, fun, rpg` }, { quoted: msg })

    let partes = text.split('/')
    if (partes.length < 2) return sock.sendMessage(msg.chat, { text: '❌ Usa: carpeta|nombre' }, { quoted: msg })

    let carpeta = partes[0].trim().toLowerCase()
    let nombre = partes[1].trim().toLowerCase()
    if (!nombre.endsWith('.js')) nombre += '.js'

    let filePath = path.join('./cmds', carpeta, nombre)

    if (!fs.existsSync(filePath)) return sock.sendMessage(msg.chat, { text: `❌ No existe ${filePath}` }, { quoted: msg })

    fs.unlinkSync(filePath)

    sock.sendMessage(msg.chat, { text: `✅ *Eliminado:* ${filePath}\n\nRecuerda hacer.update y quitarlo del menu a mano` }, { quoted: msg })
  }
}