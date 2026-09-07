import db from "#db"
import fetch from 'node-fetch'
import FormData from 'form-data'

export default {
  command: ['tourl', 'tourlperma', 'up'],
  category: 'tools',
  run: async ({ msg, sock, args }) => {
    try {
      if (!msg.quoted) {
        return msg.reply('《✧》 Responde a una imagen, video o sticker para subirlo.')
      }

      const quoted = msg.quoted
      let mediaBuffer = null
      let mimeType = quoted.mime || quoted.mimetype || ''

      if (typeof quoted.download === 'function') {
        mediaBuffer = await quoted.download()
      }

      if (!mediaBuffer && quoted.mediaBuffer) {
        mediaBuffer = quoted.mediaBuffer
        if (typeof mediaBuffer === 'string') {
          mediaBuffer = Buffer.from(mediaBuffer, 'base64')
        }
      }

      if (!mediaBuffer || mediaBuffer.length === 0) {
        return msg.reply('《✧》 No se pudo obtener el contenido.')
      }

      await msg.react('⏳')

      let form = new FormData()
      let ext = mimeType.split('/')[1] || 'bin'
      form.append('file', mediaBuffer, `file.${ext}`)

      let res = await fetch('https://nyxdlapi.vercel.app/api/tools/tourl?apikey=nyx_787L2nSRmybr98xh2T7eR7Xr2WUXKdyx', {
        method: 'POST',
        body: form
      })

      let json = await res.json()

      if (!json.status) {
        await msg.react('❌')
        return msg.reply(`《✧》 Error: ${json.creator}`)
      }

      let url = json.result.files[0].url
      let name = json.result.files[0].name
      let size = (json.result.files[0].size / 1024).toFixed(2)

      await msg.react('✅')
      return msg.reply(`*TOURL PERMANENTE* 🩸\n\n*Archivo:* ${name}\n*Peso:* ${size} KB\n*Link:* ${url}\n\n*Host:* Vercel Storage\n*No expira*`)

    } catch (e) {
      await msg.react('❌')
      return msg.reply(`《✧》 Error: ${e.message}`)
    }
  }
}