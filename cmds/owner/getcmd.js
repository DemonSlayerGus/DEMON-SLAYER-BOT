import fs from 'fs'
import path from 'path'

export default {
  command: ['getcmd', 'vercmd'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, args }) => {
    if (!args[0]) return msg.reply('「✦」Uso: *.getcmd nombrecomando*\n> ✐ Ejemplo: *.getcmd mute*')
    const cmdName = args[0].toLowerCase()
    let cmdPath = ''
    const folders = fs.readdirSync('./cmds')
    for (const folder of folders) {
      const filePath = path.join('./cmds', folder, `${cmdName}.js`)
      if (fs.existsSync(filePath)) { cmdPath = filePath; break }
    }
    if (!cmdPath) return msg.reply(`「✦」No encontré *${cmdName}.js*`)
    const code = fs.readFileSync(cmdPath, 'utf8')
    if (code.length > 3500) {
      await sock.sendMessage(msg.chat, { document: Buffer.from(code), fileName: `${cmdName}.js`, mimetype: 'text/javascript' })
      return msg.reply(`「✦」Te lo envié como archivo porque es muy largo`)
    }
    msg.reply(`「✦」Código de *${cmdName}.js*\n\n\`\`js\n${code}\n\`\`\``)
  }
}