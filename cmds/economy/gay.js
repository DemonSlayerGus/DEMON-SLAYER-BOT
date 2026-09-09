export default {
  command: ["gay", "porcentaje", "queergay"],
  category: "utils",
  run: async ({ msg, sock }) => {
    try {
      let objetivo = null
      if (msg.quoted) {
        objetivo = msg.quoted.sender || msg.quoted.key?.participant || msg.quoted.key?.remoteJid
      } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        objetivo = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
      } else {
        objetivo = msg.sender // Si no menciona, es al que lo escribe
      }

      const num = objetivo.split('@')[0]
      const porcentaje = Math.floor(Math.random() * 101) // 0 - 100%

      let comentario = ""
      if (porcentaje === 0) comentario = "🤣 Ni de chiste, eres puro hetero"
      else if (porcentaje < 20) comentario = "🙄 Muy poquito, casi no se nota"
      else if (porcentaje < 50) comentario = "😏 Se siente el ambiente, no?"
      else if (porcentaje < 80) comentario = "🌈 Bastante, hay que aceptarlo"
      else if (porcentaje < 100) comentario = "💅 Muy orgulloso y brillante!"
      else comentario = "🏳️‍🌈 ¡EL REY DEL ARCOÍRIS! 🌈✨"

      await sock.sendMessage(msg.chat, {
        text: `🏳️‍🌈 *DETECTOR DE GAY* 🏳️‍🌈

> @${num} es un...
> *${porcentaje}%* gay 🏳️‍🌈

${comentario}`,
        mentions: [objetivo]
      }, { quoted: msg })

      await msg.react("🌈")

    } catch (err) {
      console.error("❌ Error en gay:", err)
      msg.reply("《✧》 Se rompió el detector 😂")
    }
  }
}