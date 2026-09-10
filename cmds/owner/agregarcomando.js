import db from "#db"
import fs from 'fs'
import path from 'path'

const COMANDOS_FILE = path.resolve('./lib/system/comandos.js')

export default {
  command: ['agregarcomando', 'nuevocmd'],
  // ❌ Quité 'addcmd' para no chocar con el tuyo
  category: 'owner',
  desc: 'Agrega un comando al menú con / como separador (solo owner)',
  uso: 'nombre / descripción / alias1,alias2 / categoría / uso',
  run: async ({ msg, sock, args, usedPrefix: prefix }) => {
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const owners = [...global.owner.map(n => n + '@s.whatsapp.net'), botSettings.owner]
    const sender = msg.sender

    if (!owners.includes(sender)) {
      return msg.reply('🩸 *Solo mi creador puede usar este comando*')
    }

    const texto = args.join(' ').trim()
    if (!texto.includes(' / ')) {
      return msg.reply(`📝 *Uso:*
${prefix}agregarcomando nombre / descripción / alias1,alias2 / categoría / [uso]

*Ejemplo:*
${prefix}agregarcomando mine / Mina monedas diarias / mina,minar / economia / [cantidad]

Si no tienes "uso", déjalo vacío al final.`)
    }

    const partes = texto.split(' / ').map(p => p.trim())
    const [name, desc, aliasStr, category, uso] = partes

    if (!name || !desc || !aliasStr || !category) {
      return msg.reply('❌ Faltan datos. Revisa el ejemplo.')
    }

    // Formatear alias con / delante como tú los usas
    const alias = aliasStr.split(',').map(a => {
      const limpio = a.trim().replace(/^[\/\s]+/, '')
      return '/' + limpio
    })

    const nuevo = { name, desc, alias, category }
    if (uso) nuevo.uso = uso

    try {
      let contenido = fs.readFileSync(COMANDOS_FILE, 'utf-8')

      // Convertir a JSON para insertar bien
      const insercion = `    ${JSON.stringify(nuevo, null, 4).replace(/\n/g, '\n    ')}`
      
      // Insertar antes del cierre del array
      contenido = contenido.replace(/(\s*\];\s*)$/, `,\n${insercion}\n$1`)

      fs.writeFileSync(COMANDOS_FILE, contenido, 'utf-8')

      await msg.reply(`✅ *Comando agregado!*

📄 Nombre: ${name}
📝 Desc: ${desc}
🏷️ Alias: ${alias.join(' ')}
📂 Categoría: ${category}
${uso ? `ℹ️ Uso: ${uso}` : ''}

Ya aparece en el menú.`)

    } catch (err) {
      console.error(err)
      return msg.reply(`❌ Error: ${err.message}`)
    }
  }
}
