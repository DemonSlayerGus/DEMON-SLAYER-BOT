import yts from 'yt-search'
import fetch from 'node-fetch'
import { getBuffer } from '#serialize'

export default {
  command: ['play2', 'mp4', 'ytmp4'],
  category: 'downloader',
  run: async ({ msg, sock, args }) => {
    try {
      if (!args[0]) return msg.reply('《✧》 Manda el nombre o link del video')

      await msg.react("🕐")
      const text = args.join(' ')
      const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
      const query = videoMatch? 'https://youtu.be/' + videoMatch[1] : text

      const search = await yts(query)
      const videoInfo = videoMatch? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] : search.all[0]
      if (!videoInfo) return msg.reply('《✧》 No encontré ese video.')

      const { url, title, views, author, image, timestamp } = videoInfo
      const thumb = await getBuffer(image)

      const caption = `╭─「 *DESCARGA VIDEO* 」
│ *Título:* ${title}
│ *Canal:* ${author?.name || 'Desconocido'}
│ *Duración:* ${timestamp}
│ *Vistas:* ${views.toLocaleString()}
│ *Calidad:* 480p
╰─「 *Descargando...* 」`

      await sock.sendMessage(msg.chat, { image: thumb, caption }, { quoted: msg })

      const apiKey = "yosoyyo_sk_dk72d73o"
      const endpoint = `https://api-yosoyyo-api-ofc.onrender.com/api/youtube/v2?url=${encodeURIComponent(url)}&format=mp4&apiKey=${apiKey}`
      const res = await fetch(endpoint).then(r => r.json())

      if (!res?.status ||!res.result?.results?.length) return msg.reply('《✧》 Error al obtener el video')

      // Solo agarrar 480p
      const video480 = res.result.results.find(v => v.type === "video" && v.quality === "480p") || res.result.results.find(v => v.type === "video")

      if (!video480) return msg.reply('《✧》 No hay video disponible')

      await sock.sendMessage(msg.chat, {
        video: { url: video480.download },
        mimetype: 'video/mp4',
        fileName: `${title} [480p].mp4`,
        caption: `*${title}*\n> 480p | Descarga rápida`
      }, { quoted: msg })

      await msg.react("✅")
    } catch (e) {
      console.log(e)
      await msg.react("❌")
      msg.reply('《✧》 Error al procesar')
    }
  }
}