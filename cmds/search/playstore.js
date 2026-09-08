import axios from "axios"

export default {
  command: ['playstore', 'apk'],
  category: 'search',
  run: async ({ msg, sock, text }) => {
    if (!text) return msg.reply(`❌ *Uso:*.playstore <nombre de la app>`)

    await msg.react("🕕")
    try {
      let { data } = await axios.get(`https://api.delirius.online/search/playstore?q=${encodeURIComponent(text)}&limit=1&lang=es`)

      if (!data.status ||!data.data.length) return msg.reply("❌ No se encontró la app")

      let app = data.data[0]

      let caption = `「✦」*PlayStore Search*\n\n`
      caption += `*Nombre:* ${app.title}\n`
      caption += `*Desarrollador:* ${app.developer}\n`
      caption += `*Puntuación:* ${app.score_text} ⭐\n`
      caption += `*Precio:* ${app.free ? 'Gratis' : 'Pago'}\n`
      caption += `*Descripción:* ${app.descriptiom}\n`
      caption += `*Link:* ${app.url}`

      await sock.sendMessage(msg.chat, {
        image: { url: app.image },
        caption: caption
      }, { quoted: msg })

      await msg.react("✅")
    } catch (e) {
      console.log(e)
      await msg.react("❌")
      msg.reply("❌ Error al buscar en PlayStore")
    }
  }
}