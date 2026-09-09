import fetch from "node-fetch"

export default {
  command: ["pp", "pfpfake", "perfilfake"],
  category: "utils",
  run: async ({ msg, sock }) => {
    try {
      // Obtener a quién se lo hacemos
      let objetivo = null
      if (msg.quoted) {
        objetivo = msg.quoted.sender || msg.quoted.key?.participant || msg.quoted.key?.remoteJid
      } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        objetivo = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
      }

      if (!objetivo) {
        return msg.reply("《✧》 Menciona o responde a alguien\n> Ejemplo: .pp @amigo")
      }

      await msg.react("📸")

      // Usar API de imágenes aleatorias
      const imagenes = [
        "https://picsum.photos/500/500?random=1",
        "https://picsum.photos/500/500?random=2",
        "https://picsum.photos/500/500?random=3",
        "https://picsum.photos/500/500?random=4",
        "https://picsum.photos/500/500?random=5"
      ]
      const imgRandom = imagenes[Math.floor(Math.random() * imagenes.length)]
      const num = objetivo.split('@')[0]

      await sock.sendMessage(msg.chat, {
        image: { url: imgRandom },
        caption: `📸 *FOTO DE PERFIL FAKE*\n\n> Para: @${num}\n> Qué tal te queda? 😏`,
        mentions: [objetivo]
      }, { quoted: msg })

      await msg.react("✅")

    } catch (err) {
      console.error("❌ Error en pp:", err)
      msg.reply("《✧》 No pude generar la foto 😔")
    }
  }
}