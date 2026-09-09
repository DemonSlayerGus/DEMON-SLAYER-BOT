import fs from "fs"
import path from "path"

export default {
  command: ['setmenu', 'addmenu'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if(!text) return sock.sendMessage(msg.chat, { 
      text: `「📝」 *USO*\n.setmenu name|desc|alias1,alias2|category|uso\n\n*Ejemplo:*\n.setmenu poema|Dedica un poema| .poema,.dedicar |social|<mention>` 
    }, { quoted: msg })

    try {
      // Usamos | en vez de JSON para que no se rompa
      let [name, desc, aliasStr, category, uso] = text.split('|').map(s => s.trim())
      
      if(!name || !desc || !category) return sock.sendMessage(msg.chat, { text: "Faltan datos bro" }, { quoted: msg })
      
      let alias = aliasStr ? aliasStr.split(',').map(a => a.trim()) : [`.`+name]
      
      const filePath = path.join(process.cwd(), 'lib/system/comandos.js')
      const backupPath = path.join(process.cwd(), `lib/system/comandos.backup.${Date.now()}.js`)
      
      let data = fs.readFileSync(filePath, 'utf8')
      fs.writeFileSync(backupPath, data, 'utf8')
      
      if(data.includes(`name: '${name}'`) || data.includes(`name: "${name}"`)){
        return sock.sendMessage(msg.chat, { text: `⚠️ *${name}* ya existe bro.` }, { quoted: msg })
      }

      // Escapar comillas simples para que no rompa el js
      desc = desc.replace(/'/g, "\\'")
      uso = uso.replace(/'/g, "\\'")
      
      const entrada = `    {
      name: '${name}',
      desc: '${desc}',
      alias: ${JSON.stringify(alias)},
      category: '${category}',
      uso: '${uso}'
    },\n`
      
      const regex = new RegExp(`(${category}:\\s*\\[)([\\s\\S]*?)(\\s*\\])`, 'm')
      
      if(!regex.test(data)){
        return sock.sendMessage(msg.chat, { text: `❌ No encontré la categoría "${category}"` }, { quoted: msg })
      }

      data = data.replace(regex, `$1$2${entrada}$3`)
      fs.writeFileSync(filePath, data, 'utf8')
      
      await sock.sendMessage(msg.chat, { 
        text: `「✅」 *LISTO*\n\n*${name}* agregado a *${category}*\nBackup: ${backupPath.split('/').pop()}\n\n*.restart*` 
      }, { quoted: msg })

    } catch(e) {
      await sock.sendMessage(msg.chat, { text: `❌ Error: ${e.message}` }, { quoted: msg })
    }
  }
}