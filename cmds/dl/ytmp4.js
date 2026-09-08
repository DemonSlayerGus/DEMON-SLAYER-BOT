import axios from "axios"

export default {
  command: ['ytmp4', 'ytv'],
  category: 'dl',
  run: async ({ msg, sock, text }) => {
    if (!text) return msg.reply(`❌ *Uso:*.ytmp4 <link>`)

    await msg.react("🕕")
    try {
      let { data } = await axios.get(`https://api.delirius.online/download/ytmp4?url=${text}&format=360p`)
      
      if (!data.status) return msg.reply("❌ Error de la API")

      let dl = data.data

      await sock.sendMessage(msg.chat, {
        video: { url: dl.download },
        caption: `「✦」*YouTube MP4*\n\n*Title:* ${dl.title}\n*Author:* ${dl.author}\n*Views:* ${Number(dl.views).toLocaleString()}\n*Quality:* ${dl.format}\n*Source:* Delirius`
      }, { quoted: msg })

      await msg.react("✅")
    } catch (e) {
      console.log(e)
      await msg.react("❌")
      msg.reply("❌ No se pudo descargar")
    }
  }
}