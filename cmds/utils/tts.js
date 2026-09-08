import axios from "axios"

export default {
  command: ['tts', 'say'],
  category: 'utils',
  run: async ({ msg, sock, text }) => {
    if (!text) return msg.reply(`❌ *Uso:*.tts <texto>\n*Ej:* .tts Hola como estas`)

    await msg.react("🕕")
    try {
      let apikey = "nyx_Ov8ANqlTcZwmVI9OpkJIaz5gjJoFjiDL"
      
      let { data } = await axios.get(`https://nyxdlapi.vercel.app/api/tools/tts?apikey=${apikey}&text=${encodeURIComponent(text)}&lang=es`)

      if (!data.status) return msg.reply("❌ Error en la API: " + data.message)

      let audio = data.result.audio

      await sock.sendMessage(msg.chat, {
        audio: { url: audio },
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: msg })

      await msg.react("✅")
    } catch (e) {
      console.log(e)
      await msg.react("❌")
      msg.reply("❌ No se pudo generar el audio")
    }
  }
}