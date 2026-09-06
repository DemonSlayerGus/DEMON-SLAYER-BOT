import db from "#db"
import fetch from 'node-fetch'

export default {
  command: ['fb', 'facebook', 'fbdl'],
  category: 'utils',
  run: async ({ msg, sock, args }) => {
    const url = args[0]

    if (!url ||!url.includes('facebook.com')) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON FACEBOOK DOWNLOADER* ⚔️

𖣣ֶㅤ֯⌗ 📌 *Uso:*.fb <link_facebook>
𖣣ֶㅤ֯⌗ 📌 *Ejemplo:*.fb https://www.facebook.com/share/v/...`
      }, { quoted: msg })
    }

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '⏳', key: msg.key } })

    try {
      const apiUrl = `https://api.delirius.online/download/facebook?url=${encodeURIComponent(url)}`
      const res = await fetch(apiUrl)
      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        throw new Error('API devolvió HTML. Puede estar caída')
      }

      if (!json.status) {
        throw new Error(json.message || 'No se pudo descargar')
      }

      const video = json.list[0] // 720p HD

      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: video.url },
        caption: `《🩸》 *FACEBOOK VIDEO* ⚔️

𖣣ֶㅤ֯⌗ 🎬 *Calidad:* ${video.quality}
𖣣ֶㅤ֯⌗ 👑 *Creador:* ${json.creator}
𖣣ֶㅤ֯⌗ 🔗 *Original:* ${url}`
      }, { quoted: msg })

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } })

    } catch (e) {
      console.log(e)
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } })
      await sock.sendMessage(msg.key.remoteJid, {text: `《🩸》 Error: ${e.message}`}, {quoted: msg})
    }
  },
}