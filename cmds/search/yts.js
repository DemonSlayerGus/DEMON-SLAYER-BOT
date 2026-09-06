import db from "#db"
import fetch from 'node-fetch'

export default {
  command: ['yts'],
  category: 'search',
  run: async ({ msg, sock, args }) => {
    const query = args.join(' ')

    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON YTS* ⚔️\n\n𖣣ֶㅤ֯⌗ 📌 *Uso:*.yts <nombre>`
      }, { quoted: msg })
    }

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '⏳', key: msg.key } })

    try {
      const apiUrl = `https://api.delirius.online/search/ytsearch?q=${encodeURIComponent(query)}`
      const res = await fetch(apiUrl)
      const text = await res.text() // primero texto
      let json
      
      try {
        json = JSON.parse(text) // luego parsear
      } catch {
        throw new Error('La API no respondió bien. Intenta de nuevo')
      }

      if (!json.status) throw new Error(json.message || 'Error de API')
      if (!json.data || json.data.length === 0) throw new Error('Sin resultados')

      let txt = `《🩸》 *YTS: ${query}* ⚔️\n\n`
      json.data.slice(0, 5).forEach((v, i) => {
        txt += `𖣣ֶㅤ֯⌗ ${i+1}. ${v.title}\n`
        txt += `    ⏱️ ${v.duration} | ${v.author.name}\n`
        txt += `    ${v.url}\n\n`
      })
      txt += `《⚔️》 Copia el link y usa .yt o .ytmp3`

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: json.data[0].thumbnail },
        caption: txt
      }, { quoted: msg })

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } })

    } catch (e) {
      console.log('YTS ERROR:', e)
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } })
      await sock.sendMessage(msg.key.remoteJid, {text: `《🩸》 Error: ${e.message}`}, {quoted: msg })
    }
  },
}