import fetch from 'node-fetch'

export default {
  command: ['play2'],
  category: 'multimedia',
  help: ['play2 <texto|link>'],
  run: async ({ msg, sock, args }) => {
    const text = args.join(' ')
    if (!text) return msg.reply(`「✦」Escribe el nombre o link del video.\n> ✐ Ejemplo » *.play2 lovely*`)

    await msg.react('🕒')

    try {
      const apiUrl = `https://yosoyyo-api-ofc.onrender.com/api/youtube?q=${encodeURIComponent(text)}&apiKey=${global.api}`
      const response = await fetch(apiUrl)
      const json = await response.json()

      if (!json.result || json.result.length === 0) {
        return msg.reply('「✦」No se encontraron resultados.')
      }

      const video = json.result[0]
      const { title, videoUrl, thumbnailUrl, channelName, duration, download } = video
      const mp4Url = download?.mp4

      const caption = `🎞️ *Reproduciendo Video*
━━━━━━━━━━━━━━
📌 *Título:* ${title}
👤 *Canal:* ${channelName}
⏱️ *Duración:* ${duration}
🔗 *Link:* ${videoUrl}
━━━━━━━━━━━━━━`

      await sock.sendMessage(msg.chat, {
        image: { url: thumbnailUrl || 'https://i.ytimg.com/vi/error/hqdefault.jpg' },
        caption
      }, { quoted: msg })

      if (mp4Url) {
        await sock.sendMessage(msg.chat, {
          video: { url: mp4Url },
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`,
          caption: `🎬 ${title}`
        }, { quoted: msg })
        await msg.react('✅')
      } else {
        throw new Error('No se pudo obtener el enlace de descarga MP4.')
      }

    } catch (e) {
      console.error(e)
      await msg.react('❌')
      msg.reply(`「✦」Ocurrió un error inesperado.\n\n> 🧩 Error:\n\`\`\`\n${e.message || e}\n\`\`\``)
    }
  }
}