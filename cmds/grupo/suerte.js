export default {
  command: ["suerte", "queonda", "hoyestoy"],
  category: "diversion",
  run: async ({ msg, sock }) => {
    try {
      const nivel = Math.floor(Math.random() * 101)
      let mensaje = ""

      if (nivel < 20) mensaje = "😪 Hoy no es tu día, mejor quédate en casa y descansa."
      else if (nivel < 40) mensaje = "🙂 Día normal, nada especial, pero tampoco va mal."
      else if (nivel < 60) mensaje = "🙂 Va subiendo... ten paciencia que algo bueno viene."
      else if (nivel < 80) mensaje = "🍀 ¡Buena suerte hoy! Aprovecha para hacer planes."
      else if (nivel < 100) mensaje = "✨ ¡Mucha suerte hoy! Puedes intentar cosas nuevas."
      else mensaje = "🌟 ¡HOY ES TU DÍA! Todo te va a salir bien. A por todas 💪"

      await sock.sendMessage(msg.chat, {
        text: `🍀 *¿QUÉ TAL ESTOY HOY?* 🍀

> Tu suerte hoy: *${nivel}%*

${mensaje}`
      }, { quoted: msg })

      await msg.react("🍀")
    } catch (err) {
      console.error("❌ Error en suerte:", err)
      msg.reply("《✧》 Se me perdió la suerte 😅")
    }
  }
}