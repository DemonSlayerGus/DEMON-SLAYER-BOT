import db from "#db"
import fetch from 'node-fetch'

export default {
  command: ['fbsearch', 'fbbuscar', 'buscarfb'],
  category: 'search',
  run: async ({ msg, sock, args }) => {
    const query = args.join(' ')

    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON FB SEARCH* ⚔️\n\n𖣣ֶㅤ֯⌗ 📌 *Uso:*.fbsearch <que_buscar>`
      }, { quoted: msg })
    }

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '⏳', key: msg.key } })

    try {
      const apiUrl = `https://api.delirius.online/search/facebooksearch?query=${encodeURIComponent(query)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status ||!json.data || json.data.length === 0) {
        throw new Error('No se encontraron resultados')
      }

      let caption = `《🩸》 *RESULTADOS FB* ⚔️\n\n`
      caption += `𖣣ֶㅤ֯⌗ 🔍 *Busqueda:* ${query}\n`
      caption += `𖣣ֶㅤ֯⌗ 👑 *Creador:* ${json.creator}\n\n`

      const results = json.data.slice(0, 5)
      results.forEach((v, i) => {
        // Cortar descripción larga
        const desc = v.description ? v.description.substring(0, 80) + '...' : 'Sin descripción'
        caption += `𖣣ֶㅤ֯⌗ ${i+1}. *${v.title}*\n`
        caption += `    📝 ${desc}\n`
        caption += `    🔗 ${v.url}\n\n`
      })

      caption += `《⚔️》 Usa .fb <link> para descargar`

      // Como no hay thumbnail usamos una imagen default del bot
      await sock.sendMessage(msg.key.remoteJid, {
        text: caption
      }, { quoted: msg })

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } })

    } catch (e) {
      console.log(e)
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } })
      await sock.sendMessage(msg.key.remoteJid, {text: `《🩸》 Error: ${e.message}`}, {quoted: msg})
    }
  },
}