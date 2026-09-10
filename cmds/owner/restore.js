import fs from 'fs'

export default {
  command: ['restore'],
  category: 'owner',
  owner: true, // SOLO OWNER
  run: async ({ msg, args }) => {
    const owner = global.owner?.[0] + '@s.whatsapp.net'
    if (msg.sender!== owner) return msg.reply('「❌」 *SOLO OWNER*')

    if (!args[0]) return msg.reply(`*Uso:*.restore <ruta/archivo.js>\n*Ejemplo:*.restore plugins/economia/mine.js`)

    const ruta = args[0]
    const fecha = new Date().toLocaleDateString('es-PE').replace(/\//g, '-')
    const backup = `${ruta}.bak-${fecha}`

    if (!fs.existsSync(backup)) return msg.reply(`「❌」 *NO HAY BACKUP DE HOY*\nNo encontré: ${backup}\n\nPrimero usa:.backup ${ruta}`)

    try {
      fs.copyFileSync(backup, ruta)
      await msg.reply(`「✅」 *RESTAURADO*\n\n*De:* ${backup}\n*A:* ${ruta}\n\nUsa.restart para aplicar`)
      await msg.react('🔄')
    } catch(e) {
      msg.reply(`「❌」 *ERROR:* ${e.message}`)
    }
  }
}