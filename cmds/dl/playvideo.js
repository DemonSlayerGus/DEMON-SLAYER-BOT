import fetch from "node-fetch"

const API_URL = "https://api-yosoyyo-api-ofc.onrender.com/api/youtube"
const API_KEY = "yosoyyo_sk_dk72d73o"

export default {
  command: ["playvideo", "mp4", "ytmp4", "video"],
  category: "downloader",
  run: async ({ msg, sock, args }) => {
    try {
      if (!args[0]) {
        return msg.reply("《✧》Uso: .playvideo nombre o canción")
      }

      const text = args.join(" ")
      await msg.react("🎥")

      const searchUrl = `${API_URL}?q=${encodeURIComponent(text)}&apiKey=${API_KEY}`
      const res = await fetch(searchUrl, { timeout: 20000 })
      const data = await res.json()

      if (!data.result?.length) {
        return msg.reply("《✧》 No encontré resultados 😔")
      }

      const video = data.result[0]

      // 🔍 Probar todas las rutas para MP4
      let mp4Url = ""
      if (video.download?.mp4 && video.download.mp4.trim()) {
        mp4Url = video.download.mp4
      } else if (video.downloads?.mp4?.url && video.downloads.mp4.url.trim()) {
        mp4Url = video.downloads.mp4.url
      } else if (video.downloads?.mixed?.mp4 && video.downloads.mixed.mp4.trim()) {
        mp4Url = video.downloads.mixed.mp4
      }

      if (!mp4Url) {
        return msg.reply("《✧》 El enlace de video no está disponible 😔")
      }

      await sock.sendMessage(msg.chat, {
        text: `🎥 *DEMON VIDEO* 🥷

📌 *Título:* ${video.title}
📺 *Canal:* ${video.channelName || "Desconocido"}
⏱️ *Duración:* ${video.duration || "Desconocida"}

> Descargando video... 🎬`
      }, { quoted: msg })

      const videoRes = await fetch(mp4Url, { timeout: 120000 })
      if (!videoRes.ok) throw new Error(`Error al descargar: ${videoRes.status}`)
      
      const videoBuffer = Buffer.from(await videoRes.arrayBuffer())
      
      await sock.sendMessage(msg.chat, {
        video: videoBuffer,
        mimetype: "video/mp4",
        fileName: `${video.title}.mp4`,
        caption: `🎥 ${video.title}`
      }, { quoted: msg })

      await msg.react("✅")

    } catch (err) {
      console.error("❌ Error:", err)
      return msg.reply("《✧》 Ocurrió un error 😔\n> " + err.message)
    }
  }
}