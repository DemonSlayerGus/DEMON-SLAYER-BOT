export default {
  command: ["ship", "shippear", "pareja", "amoryamistad"],
  category: "diversion",
  run: async ({ msg, sock }) => {
    try {
      let persona1 = msg.sender
      let persona2 = null
      let mencionados = []

      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        mencionados = msg.message.extendedTextMessage.contextInfo.mentionedJid
      }
      if (msg.quoted) {
        persona2 = msg.quoted.sender || msg.quoted.key?.participant || msg.quoted.key?.remoteJid
      }
      if (mencionados.length >= 1) persona2 = mencionados[0]
      if (mencionados.length >= 2) {
        persona1 = mencionados[0]
        persona2 = mencionados[1]
      }

      if (!persona2) {
        return msg.reply("《✧》 Menciona a dos personas\n> Ejemplo: .ship @a @b")
      }

      const p1 = persona1.split('@')[0]
      const p2 = persona2.split('@')[0]
      const porcentaje = Math.floor(Math.random() * 101)
      const mitad1 = p1.slice(0, Math.ceil(p1.length / 2))
      const mitad2 = p2.slice(Math.floor(p2.length / 2))
      const nombreShip = mitad1 + mitad2

      let comentario = ""
      if (porcentaje < 30) comentario = "😬 Mejor se quedan como amigos, no se ve la química..."
      else if (porcentaje < 60) comentario = "🤔 Quizás, quizás... hay que darle tiempo"
      else if (porcentaje < 85) comentario = "😏 ¡Se siente el amor! Tienen futuro juntos"
      else comentario = "💞 ¡HECHO EN EL CIELO! La pareja del grupo sin duda"

      await sock.sendMessage(msg.chat, {
        text: `💞 *SHIPPING* 💞

> @${p1} + @${p2} = 💖 *${nombreShip}* 💖
> Nivel de amor: *${porcentaje}%*

${comentario}`,
        mentions: [persona1, persona2]
      }, { quoted: msg })

      await msg.react("💞")
    } catch (err) {
      console.error("❌ Error en ship:", err)
      msg.reply("《✧》 Se rompió el barco 😂")
    }
  }
}