import fetch from "node-fetch"

const API_URL = "https://api-yosoyyo-api-ofc.onrender.com/api/youtube"
const API_KEY = "yosoyyo_sk_dk72d73o"

export default {
  command: ["play", "mp3", "ytmp3", "ytaudio", "playaudio"],
  category: "downloader",
  run: async ({ msg, sock, args }) => {
    try {
      if (!args[0]) {
        return msg.reply("《✧》Uso: .play nombre o canción")
      }

      const text = args.join(" ")
      await msg.react("🎧")

      const searchUrl = `${API_URL}?q=${encodeURIComponent(text)}&apiKey=${API_KEY}`
      const res = await fetch(searchUrl, { timeout: 20000 })
      const data = await res.json()

      // ✅ Aceptar también si no viene status=200 pero sí hay resultados
      if (!data.result || !Array.isArray(data.result) || !data.result.length) {
        return msg.reply("《✧》 No encontré resultados 😔")
      }

      const video = data.result[0]

      // 🔍 Probar TODAS las rutas donde puede estar el enlace MP3
      let mp3Url = ""
      
      if (video.download?.mp3 && video.download.mp3.trim()) {
        mp3Url = video.download.mp3
      } else if (video.downloads?.mp3?.url && video.downloads.mp3.url.trim()) {
        mp3Url = video.downloads.mp3.url
      } else if (video.downloads?.mixed?.mp3 && video.downloads.mixed.mp3.trim()) {
        mp3Url = video.downloads.mixed.mp3
      }

      if (!mp3Url) {
        return msg.reply("《✧》 El enlace de descarga no está disponible 😔\nPrueba con otra canción")
      }

      // 📤 Enviar información
      await sock.sendMessage(msg.chat, {
        text: `🎧 *SHINOBI PLAY* 🥷

📌 *Título:* ${video.title}
📺 *Canal:* ${video.channelName || "Desconocido"}
⏱️ *Duración:* ${video.duration || "Desconocida"}

> Descargando audio... 🎶`
      }, { quoted: msg })

      // ⬇️ Descargar y enviar como buffer
      const audioRes = await fetch(mp3Url, { timeout: 60000 })
      if (!audioRes.ok) throw new Error(`Error al descargar: ${audioRes.status}`)
      
      const audioBuffer = Buffer.from(await audioRes.arrayBuffer())
      
      await sock.sendMessage(msg.chat, {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: `${video.title}.mp3`
      }, { quoted: msg })

      await msg.react("✅")

    } catch (err) {
      console.error("❌ Error:", err)
      return msg.reply("《✧》 Ocurrió un error 😔\n> " + err.message)
    }
  }
}
