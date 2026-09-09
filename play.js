export default {
  command: ['ytmp3', 'mp3'],
  category: 'music',
  run: async ({ msg, sock, text }) => {
    const chat = msg.chat
    const apiKey = 'yosoyyo_sk_dk72d73o'

    if (!text) return msg.reply('「✦」Pon el nombre o link de YouTube\nEjemplo:.ytmp3 ozuna una flor')

    try {
      await msg.react('⏳')

      const query = encodeURIComponent(text)
      const res = await fetch(`https://api-yosoyyo-api-ofc.onrender.com/api/youtube?q=${query}&apiKey=${apiKey}`)
      const json = await res.json()

      if (json.status!== 200 ||!json.result || json.result.length === 0) {
        return msg.reply('「✦」No encontré resultados')
      }

      const song = json.result[0]
      const titulo = song.title
      const canal = song.channelName
      const duracion = song.duration
      const thumb = song.thumbnailUrl
      const audioUrl = song.download.mp3 || song.downloads.mp3.url
      const videoUrl = song.videoUrl

      let txt = `「✦」 *YOSOYYO YTMP3*\n\n`
      txt += `> 🎵 *Título:* ${titulo}\n`
      txt += `> 👤 *Canal:* ${canal}\n`
      txt += `> ⏱️ *Duración:* ${duracion}\n`
      txt += `> 📥 *Descarga MP3:* ${audioUrl}\n`
      txt += `> 🔗 *YouTube:* ${videoUrl}`

      await sock.sendMessage(chat, {
        image: { url: thumb },
        caption: txt
      }, { quoted: msg })

      await msg.react('✅')

    } catch (e) {
      console.log(e)
      await msg.reply('「✦」Error. Intenta de nuevo')
      await msg.react('❌')
    }
  }
}