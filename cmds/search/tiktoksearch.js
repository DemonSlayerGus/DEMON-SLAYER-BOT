import axios from 'axios'

const NYXDL_API_KEY = 'nyx_787L2nSRmybr98xh2T7eR7Xr2WUXKdyx'
const NYXDL_BASE = 'https://nyxdlapi.vercel.app'
const NYXDL_TT_SEARCH = `${NYXDL_BASE}/api/search/tiktoksearch`

function formatCount(n) {
  let num = Number(n || 0)
  return Number.isNaN(num)? '0' : num.toLocaleString('es-PE')
}

function cleanName(t) {
  if (!t) return 'Sin titulo'
  return String(t).slice(0, 50)
}

function fixUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return NYXDL_BASE + url
  return null
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
  command: ['tiktoksearch', 'ttsearch', 'tks'],
  category: 'search',
  run: async ({ msg, sock, args }) => {

    try {
      if (!args[0]) return sock.sendMessage(msg.chat, { text: "♦ Ingresa algo para buscar en TikTok" }, { quoted: msg })
      await sock.sendMessage(msg.chat, { react: { text: "🔎", key: msg.key } })

      const query = args.join(' ').trim()
      const { data } = await axios.get(`${NYXDL_TT_SEARCH}?q=${encodeURIComponent(query)}&apikey=${NYXDL_API_KEY}`)
      
      const results = data?.result?.results || []
      if (!results.length) return sock.sendMessage(msg.chat, { text: `♦ No encontre resultados para *${query}*` }, { quoted: msg })

      const usable = results.slice(0, 10) // AHORA 10
      await sock.sendMessage(msg.chat, { text: `♦ *TIKTOK SEARCH*\n*| Busqueda:* ${query}\n*| Enviando:* ${usable.length} videos en álbum...` }, { quoted: msg })

      // Creamos el "album" - Baileys lo manda como varios mensajes pero pegados
      const album = []
      for (let i = 0; i < usable.length; i++) {
        const v = usable[i]
        const title = cleanName(v.title)
        const author = v.author?.username || 'tiktok'
        const stats = v.statistics || {}
        const likes = formatCount(stats.likes)
        const views = formatCount(stats.vistas)
        const videoUrl = fixUrl(v.video)

        const caption = `♦ *${i + 1}/10* *${title}*\n*| @${author}* | ♡ ${likes} | ▶ ${views}\n*© Shinobi Bot*`

        if (videoUrl) {
          album.push({
            video: { url: videoUrl },
            caption: caption,
            mimetype: 'video/mp4'
          })
        }
        await sleep(300) // delay corto para que no lo tome como spam
      }

      // Intentamos mandar como album
      try {
        await sock.sendMessage(msg.chat, { album: album }, { quoted: msg })
      } catch {
        // Si falla el album, los manda 1x1 rapido
        for(const item of album){
          await sock.sendMessage(msg.chat, item, { quoted: msg })
          await sleep(800)
        }
      }

      await sock.sendMessage(msg.chat, { react: { text: "✅", key: msg.key } })

    } catch (e) {
      console.error(e)
      await sock.sendMessage(msg.chat, { text: `♦ Error: ${e.message}` }, { quoted: msg })
      await sock.sendMessage(msg.chat, { react: { text: "❌", key: msg.key } })
    }
  }
}