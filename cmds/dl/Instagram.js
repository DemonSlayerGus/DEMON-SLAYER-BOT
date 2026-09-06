import db from "#db"
import fetch from 'node-fetch'

export default {
  command: ['ig', 'instagram', 'igdl'],
  category: 'utils',
  run: async ({ msg, sock, args }) => {
    const url = args[0]

    if (!url ||!url.includes('instagram.com')) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON INSTAGRAM DOWNLOADER* ⚔️

𖣣ֶㅤ֯⌗ 📌 *Uso:*.ig <link_instagram>
𖣣ֶㅤ֯⌗ 📌 *Ejemplo:*.ig https://www.instagram.com/reel/...

Descarga Reels, Posts y Carrusel`
      }, { quoted: msg })
    }

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '⏳', key: msg.key } })

    try {
      const apiUrl = `https://api.delirius.online/download/instagram?url=${encodeURIComponent(url)}`
      const res = await fetch(apiUrl)
      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        throw new Error('API devolvió HTML. Link privado o API caída')
      }

      if (!json.status) {
        throw new Error(json.message || 'No se pudo descargar')
      }

      // Si es carrusel manda todos
      if (json.data.length > 1) {
        for (let i = 0; i < json.data.length; i++) {
          const item = json.data[i]
          if (item.type === 'video') {
            await sock.sendMessage(msg.key.remoteJid, {
              video: { url: item.url },
              caption: `《🩸》 *IG CARRUSEL* ${i+1}/${json.data.length}`
            })
          } else {
            await sock.sendMessage(msg.key.remoteJid, {
              image: { url: item.url },
              caption: `《🩸》 *IG CARRUSEL* ${i+1}/${json.data.length}`
            })
          }
          await new Promise(r => setTimeout(r, 500))
        }
      } else {
        // Si es 1 solo video/imagen
        const item = json.data[0]
        if (item.type === 'video') {
          await sock.sendMessage(msg.key.remoteJid, {
            video: { url: item.url },
            caption: `《🩸》 *INSTAGRAM VIDEO* ⚔️

𖣣ֶㅤ֯⌗ 👑 *Creador:* ${json.creator}
𖣣ֶㅤ֯⌗ 🔗 *Link:* ${url}`
          }, { quoted: msg })
        } else {
          await sock.sendMessage(msg.key.remoteJid, {
            image: { url: item.url },
            caption: `《🩸》 *INSTAGRAM PHOTO* ⚔️

𖣣ֶㅤ֯⌗ 👑 *Creador:* ${json.creator}`
          }, { quoted: msg })
        }
      }

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } })

    } catch (e) {
      console.log(e)
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } })
      await sock.sendMessage(msg.key.remoteJid, {text: `《🩸》 Error: ${e.message}`}, {quoted: msg})
    }
  },
}