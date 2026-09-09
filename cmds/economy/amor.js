export default {
  command: ["amor", "compatibilidad", "flechazo"],
  category: "economy",
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
      if (mencionados.length >= 1) {
        persona2 = mencionados[0]
      }
      if (mencionados.length >= 2) {
        persona1 = mencionados[0]
        persona2 = mencionados[1]
      }

      if (!persona2) {
        return msg.reply("《✧》 Menciona a dos personas o responde a alguien\n> Ejemplo: .amor @tú @ella")
      }

      const p1 = persona1.split('@')[0]
      const p2 = persona2.split('@')[0]
      const porcentaje = Math.floor(Math.random() * 101)

      let comentario = ""
      if (porcentaje < 20) comentario = "💔 Uy... mejor se quedan como amigos 😬"
      else if (porcentaje < 40) comentario = "😐 Puede que algo salga, pero hay que trabajar en ello"
      else if (porcentaje < 60) comentario = "🙂 Hay química, no se descarta 👀"
      else if (porcentaje < 80) comentario = "💛 ¡Se nota la conexión! Vale la pena intentarlo"
      else if (porcentaje < 100) comentario = "💖 ¡Qué bonito! Están hechos el uno para el otro"
      else comentario = "💘 ¡ALMA GEMELA! Destinados a estar juntos ❤️‍🔥"

      await sock.sendMessage(msg.chat, {
        text: `💘 *CALCULADORA DEL AMOR* 💘

> @${p1} ❤️ @${p2}
> *Compatibilidad: ${porcentaje}%*

${comentario}`,
        mentions: [persona1, persona2]
      }, { quoted: msg })

      await msg.react("💕")
    } catch (err) {
      console.error("❌ Error en amor:", err)
      msg.reply("《✧》 Se rompió el cupido 😂")
    }
  }
}