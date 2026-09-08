import fs from 'fs'
import path from 'path'

export default {
  command: ['editcmd'],
  category: 'owner',
  owner: true,
  run: async ({ msg, args }) => {
    if (!args[0]) return msg.reply('「✦」Uso: *.editcmd nombrecomando*\n> ✐ Responde a un mensaje con el código nuevo')
    const cmdName = args[0].toLowerCase()
    let cmdPath = ''
    const folders = fs.readdirSync('./cmds')
    for (const folder of folders) {
      const filePath = path.join('./cmds', folder, `${cmdName}.js`)
      if (fs.existsSync(filePath)) { cmdPath = filePath; break }
    }
    if (!cmdPath) return msg.reply(`「✦」No encontré *${cmdName}.js*`)
    if (!msg.quoted) return msg.reply('「✦」Responde al mensaje con el código nuevo')
    let newCode = msg.quoted.text || msg.quoted.conversation
    newCode = newCode.replace(/```js/g, '').replace(/```/g, '').trim()
    fs.writeFileSync(cmdPath, newCode, 'utf8')
    msg.reply(`「✦」*${cmdName}.js* actualizado\n> 🔄 Usa *.update* para recargar`)
  }
}