import yts from 'yt-search'
import fetch from 'node-fetch'

const API_KEY = 'nyx_787L2nSRmybr98xh2T7eR7Xr2WUXKdyx'
const API_URL = 'https://nyxdlapi.vercel.app/api/downloads/youtube'

function cleanName(name) {
  return String(name || 'audio').replace(/[^\w\s._-]/gi, '').trim().substring(0, 70)
}

function formatDuration(sec) {
  if (!sec) return 'No disponible'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

async function getYouTubeInfo(query) {
  const busqueda = await yts(query)
  if (!busqueda?.videos?.length) throw new Error('No encontré resultados.')
  return busqueda.videos[0]
}

export default {
  command: ['play', 'mp3', 'ytmp3', 'playaudio'],
  category: 'downloader',
  run: async ({ msg, sock, args, usedPrefix: prefix }) => {
    const texto = args.join(' ').trim()
    if (!texto) {
      return msg.reply(`❗ Escribe algo para buscar.\n\nEjemplo: *${prefix}play Ozuna una flor*`)
    }

    try {
      await msg.react('🔍')

      // 1. BUSCAMOS PRIMERO EN YOUTUBE
      const video = await getYouTubeInfo(texto)

      // 2. LE PASAMOS LA URL A NYX
      await msg.react('⬇️')
      const endpoint = `${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(video.url)}`
      const res = await fetch(endpoint, { timeout: 90000 })
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)

      const data = await res.json()
      if (!data.status) throw new Error('Nyx no pudo procesar el video')

      const result = data.result
      const mp3Url = result.download_url || result.download || result.url
      if (!mp3Url) throw new Error('No se obtuvo el enlace de descarga.')

      const nombreArchivo = cleanName(result.title)

      const info = `╭─『 NYX YOUTUBE PLAY 』─╮\n` +
                   `│\n` +
                   `│ 🎵 *${result.title}*\n` +
                   `│\n` +
                   `│ 👤 Canal: ${video.author.name}\n` +
                   `│ ⏱️ Duración: ${formatDuration(result.duration)}\n` +
                   `│ 👀 Vistas: ${video.views?.toLocaleString() || 'N/A'}\n` +
                   `│\n` +
                   `╰── Descargando audio...`

      await sock.sendMessage(msg.chat, {
        image: { url: result.thumbnail },
        caption: info
      }, { quoted: msg })

      // 3. DESCARGAMOS EL AUDIO
      const audioRes = await fetch(mp3Url)
      if(!audioRes.ok) throw new Error('No se pudo descargar el audio')
      const audioBuffer = await audioRes.buffer()

      // 4. LO MANDAMOS
      await sock.sendMessage(msg.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mp4',
        fileName: `${nombreArchivo}.mp3`
      }, { quoted: msg })

      await msg.react('✅')

    } catch (err) {
      console.error('[PLAY ERROR]', err)
      await msg.react('❌')
      msg.reply(`❌ No pude descargar.\n\n📄 Error: ${err.message}`)
    }
  }
}