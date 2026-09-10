import fs from 'fs'

export default {
  command: ['backup', 'bkp'],
  category: 'owner',
  owner: true, // SOLO OWNER
  run: async ({ msg, args }) => {
    const owner = global.owner?.[0] + '@s.whatsapp.net'
    if (msg.sender!== owner) return msg.reply('「❌」 *SOLO OWNER*')

    if (!args[0]) return msg.reply(`*Uso:*.backup <ruta/archivo.js>\n*Ejemplo:*.backup plugins/economia/mine.js`)

    const ruta = args[0]
    if (!fs.existsSync(ruta)) return msg.reply(`「❌」 *NO EXISTE*\nNo encontré: ${ruta}`)

    const fecha = new Date().toLocaleDateString('es-PE').replace(/\//g, '-')
    const nombreBackup = `${ruta}.bak-${fecha}`

    try {
      fs.copyFileSync(ruta, nombreBackup)
      await msg.reply(`「✅」 *BACKUP CREADO*\n\n*Original:* ${ruta}\n*Copia:* ${nombreBackup}\n\nSi la cagas usa:.restore ${ruta}`)
      await msg.react('💾')
    } catch(e) {
      msg.reply(`「❌」 *ERROR:* ${e.message}`)
    }
  }
}