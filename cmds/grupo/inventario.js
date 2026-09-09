import db from "#db"

export default {
  command: ["inventario", "inv", "mochila"],
  category: "rpg",
  run: async ({ msg, sock }) => {
    try {
      const user = await db.getChatUser(msg.chat, msg.sender)
      const items = user.inventario || []

      if (!items.length) {
        return msg.reply("《✧》 Tu inventario está vacío 😔\n> Compra algo en la tienda: .tienda")
      }

      let texto = "🎒 *TU INVENTARIO* 🎒\n\n"
      items.forEach((item, i) => {
        texto += `${i + 1}. ${item.nombre}\n> Usar: .usar ${item.id}\n\n`
      })
      texto += "💡 Ejemplo: .usar corazon @alguien\n> O responde a alguien con el comando"

      await sock.sendMessage(msg.chat, { text: texto }, { quoted: msg })
      await msg.react("🎒")

    } catch (err) {
      console.error("❌ Error en inventario:", err)
      msg.reply("《✧》 No pude abrir tu inventario 😔")
    }
  }
}
