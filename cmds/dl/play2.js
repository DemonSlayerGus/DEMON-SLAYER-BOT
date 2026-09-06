import yts from 'yt-search'
import fetch from 'node-fetch'

const API_KEY = process.env.YOSOYYO_YOUTUBE_API_KEY || 'yosoyyo_sk_fsy4b2in'
const API_URL = 'https://apiyosoyyo-ofc.onrender.com/api/youtube'

function cleanName(name) {
  return String(name || 'video').replace(/[^\w\s._-]/gi, '').trim().substring(0, 70)
}

function formatViews(views) {
  const n = Number(views)
  if (!n || Number.isNaN(n)) return 'No disponible'
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

async function getYouTubeInfo(query) {
  const busqueda = await yts(query)
  if (!busqueda?.videos?.length) throw new Error('No encontré resultados.')
  return busqueda.videos[0]
}

async function getDownloadUrl(videoUrl) {
  const endpoint = `${API_URL}?q=${encodeURIComponent(videoUrl)}&apiKey=${encodeURIComponent(API_KEY)}`
  const res = await fetch(endpoint, {
    timeout: 90000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })
  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
  
  const data = await res.json()
  const item = data?.result || data?.data
  const arr = Array.isArray(item) ? item[0] : item
  const mp4Url = arr?.download?.mp4 || arr?.downloads?.mp4?.url || arr?.dl?.mp4?.url
  if (!mp4Url) throw new Error('No se obtuvo el enlace de descarga del video.')
  return { mp4Url, title: arr?.title || 'Video' }
}

export default {
  command: ['play2', 'mp4', 'ytmp4', 'playvideo'],
  category: 'downloader',
  run: async ({ msg, sock, args, usedPrefix: prefix }) => {
    const texto = args.join(' ').trim()
    if (!texto) {
      return msg.reply(`❀ Escribe algo para buscar.\n\nEjemplo: *${prefix}play2 Ozuna una flor*`)
    }

    try {
      await msg.react('🔍')
      const video = await getYouTubeInfo(texto)
      const { mp4Url, title } = await getDownloadUrl(video.url)
      const nombreArchivo = cleanName(title || video.title)

      // 📤 Información + miniatura
      const info = `❀ *${video.title}*

✦ Canal › ${video.author.name}
◈ Vistas › ${formatViews(video.views)}
⌂ Duración › ${video.timestamp}
🔗 Enlace › ${video.url}

🎬 Descargando video...`

      await sock.sendMessage(msg.chat, {
        image: { url: video.thumbnail },
        caption: info
      }, { quoted: msg })

      // 🎬 Enviamos el video
      await sock.sendMessage(msg.chat, {
        video: { url: mp4Url },
        mimetype: 'video/mp4',
        fileName: `${nombreArchivo}.mp4`,
        caption: `❀ ✅ Video descargado\n\n♧ ${nombreArchivo}`
      }, { quoted: msg })

      await msg.react('✅')

    } catch (err) {
      console.error('[PLAY2 ERROR]', err)
      await msg.react('❌')
      msg.reply(`❌ No pude descargar el video.\n\n✦ Error: ${err.message}\n\nIntenta con otro nombre o usa el enlace directo de YouTube.`)
    }
  }
}
