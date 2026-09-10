import db from "#db"
import fs from 'fs'
import path from 'path'

export default {
  command: ['respaldo', 'backup', 'copiar'],
  category: 'owner',
  desc: 'Hace copia de seguridad de cualquier archivo del bot (solo owner)',
  uso: '<nombre_archivo>',
  run: async ({ msg, sock, args, usedPrefix: prefix }) => {
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const owners = [...global.owner.map(n => n + '@s.whatsapp.net'), botSettings.owner]
    const sender = msg.sender

    // 🔒 Solo owner
    if (!owners.includes(sender)) {
      return msg.reply('🩸 *Solo mi creador puede usar este comando*')
    }

    const busqueda = args.join(' ').trim()
    if (!busqueda) {
      return msg.reply(`📂 *Uso correcto:*
${prefix}respaldo <nombre_archivo>

Ejemplos:
${prefix}respaldo play
${prefix}respaldo database
${prefix}respaldo settings

💡 No necesitas poner .js, lo busco yo por ti!`)
    }

    // 📂 Carpetas donde buscar
    const carpetasBusqueda = [
      path.resolve('./cmds'),
      path.resolve('./lib'),
      path.resolve('./'),
    ]

    const resultados = []

    // 🔍 Buscar en todas las carpetas
    const buscar = (dir, nombre) => {
      if (!fs.existsSync(dir)) return
      const entradas = fs.readdirSync(dir, { withFileTypes: true })
      for (const entrada of entradas) {
        const rutaCompleta = path.join(dir, entrada.name)
        if (entrada.isDirectory()) {
          buscar(rutaCompleta, nombre)
        } else {
          const sinExt = path.basename(entrada.name, '.js').toLowerCase()
          const nombreArchivo = entrada.name.toLowerCase()
          const busquedaMin = nombre.toLowerCase()
          if (sinExt === busquedaMin || nombreArchivo === busquedaMin || nombreArchivo === busquedaMin + '.js') {
            resultados.push(rutaCompleta)
          }
        }
      }
    }

    for (const carpeta of carpetasBusqueda) {
      buscar(carpeta, busqueda)
    }

    if (!resultados.length) {
      return msg.reply(`❌ No encontré archivos con: *${busqueda}*
Verifica el nombre o escribe parte del nombre.`)
    }

    if (resultados.length > 1) {
      return msg.reply(`⚠️ Encontré varios archivos:
${resultados.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Escribe el nombre completo para elegir uno.`)
    }

    const rutaOriginal = resultados[0]
    const ext = path.extname(rutaOriginal) || '.js'
    const nombreBase = path.basename(rutaOriginal, ext)
    const carpetaDestino = path.dirname(rutaOriginal)
    const fecha = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const nombreRespaldo = `${nombreBase}_respaldo_${fecha}${ext}`
    const rutaRespaldo = path.join(carpetaDestino, nombreRespaldo)

    try {
      fs.copyFileSync(rutaOriginal, rutaRespaldo)
      const contenido = fs.readFileSync(rutaOriginal, 'utf-8')

      await sock.sendMessage(msg.chat, {
        text: `✅ *COPIA DE SEGURIDAD CREADA*

📄 Original: ${path.basename(rutaOriginal)}
💾 Respaldo: ${nombreRespaldo}
📂 Ubicación: ${rutaRespaldo}

Aquí tienes el contenido:`,
      }, { quoted: msg })

      // Envía el código para copiar
      if (contenido.length < 10000) {
        await sock.sendMessage(msg.chat, {
          text: `\`\`\`javascript\n${contenido}\n\`\`\``,
        })
      } else {
        await msg.reply(`📎 El archivo es muy largo, revisa el respaldo en la carpeta.`)
      }

      await msg.react('✅')

    } catch (err) {
      console.error(err)
      return msg.reply(`❌ Error al hacer la copia: ${err.message}`)
    }
  }
}
