import db from "#db"
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import fetch from 'node-fetch'
import exif from '../../lib/exif.js'
const { writeExif } = exif
const execAsync = promisify(exec)

export default {
  command: ['sticker', 's'],
  category: 'stickers',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    try {
      const quoted = msg.quoted? msg.quoted : msg
      const mime = (quoted.msg || quoted).mimetype || ''
      let user = await db.getUser(msg.sender)
      const name = user.name || 'Usuario'

      let texto1 = user.metadatos || 'Creado con Bot'
      let texto2 = user.metadatos2 || `@${name}`

      // Pack | Autor
      let marca = args.join(' ').trim().split('|').map(part => part.trim())
      let pack = marca[0] || texto1
      let author = marca[1] || texto2

      // Crear carpeta tmp si no existe
      if (!fs.existsSync('./lib/system/tmp')) fs.mkdirSync('./lib/system/tmp', { recursive: true })

      // 1. IMAGEN
      if (/image/.test(mime) &&!/webp/.test(mime)) {
        let buffer = await quoted.download()
        const media = { mimetype: mime, data: buffer }
        const metadata = { packname: pack, author: author, categories: [''] }
        const stickerPath = await writeExif(media, metadata)
        await sock.sendMessage(msg.chat, { sticker: { url: stickerPath }}, { quoted: msg })
        fs.unlinkSync(stickerPath)

      // 2. VIDEO / GIF - CONVERTIR CON FFMPEG
      } else if (/video/.test(mime)) {
        let seconds = (quoted.msg || quoted).seconds || 0
        if (seconds > 10) return msg.reply('❗ El video no puede durar más de 10 segundos')

        await msg.react('⏳')
        let buffer = await quoted.download()
        const inputFile = `./lib/system/tmp/video-${Date.now()}.mp4`
        const outputFile = `./lib/system/tmp/sticker-${Date.now()}.webp`
        
        fs.writeFileSync(inputFile, buffer)

        // Convertir a webp con ffmpeg
        const cmd = `ffmpeg -i ${inputFile} -vcodec libwebp -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15" -loop 0 -ss 00:00:00 -t 00:00:10 -preset default -an -vsync 0 ${outputFile}`
        
        await execAsync(cmd)
        fs.unlinkSync(inputFile)

        const media = { mimetype: 'image/webp', data: fs.readFileSync(outputFile) }
        const metadata = { packname: pack, author: author, categories: [''] }
        const stickerPath = await writeExif(media, metadata)
        
        await sock.sendMessage(msg.chat, { sticker: { url: stickerPath }}, { quoted: msg })
        fs.unlinkSync(outputFile)
        fs.unlinkSync(stickerPath)

      // 3. STICKER A STICKER - cambiar pack
      } else if (/webp/.test(mime)) {
        let buffer = await quoted.download()
        const media = { mimetype: 'image/webp', data: buffer }
        const metadata = { packname: pack, author: author, categories: [''] }
        const stickerPath = await writeExif(media, metadata)
        await sock.sendMessage(msg.chat, { sticker: { url: stickerPath }}, { quoted: msg })
        fs.unlinkSync(stickerPath)

      // 4. URL
      } else if (args[0] && isUrl(args[0])) {
        const url = args[0]
        const res = await fetch(url)
        if (!res.ok) return msg.reply('❗ No pude descargar ese archivo desde la URL.')
        const buffer = Buffer.from(await res.arrayBuffer())

        const media = { mimetype: 'image/png', data: buffer }
        const metadata = { packname: pack, author: author, categories: [''] }
        const stickerPath = await writeExif(media, metadata)
        await sock.sendMessage(msg.chat, { sticker: { url: stickerPath }}, { quoted: msg })
        fs.unlinkSync(stickerPath)

      } else {
        return msg.reply(`╭─『 CONVERTIR A STICKER 』─╮
│
│ Responde a una imagen, video o gif
│ o manda un link directo.
│
│ Ejemplo:
│ ${prefix + command} Mi Pack | Mi Nombre
│
╰───────────────────────────`);
      }

      await msg.react('✅')

    } catch (e) {
      console.error('[STICKER ERROR]', e)
      await msg.react('❌')
      return msg.reply(`❌ Error al crear sticker.\n\n📄 ${e.message}\n\nAsegurate de tener ffmpeg instalado`)
    }
  }
}

const isUrl = (text) => {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|mp4|webp)$/i.test(text)
}