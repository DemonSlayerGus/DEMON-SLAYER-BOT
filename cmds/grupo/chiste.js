export default {
  command: ["chiste", "broma", "cuentame"],
  category: "diversion",
  run: async ({ msg, sock }) => {
    try {
      const chistes = [
        "😂 — ¿Qué le dice un semáforo a otro?\n— ¡No me mires que me estoy cambiando!",
        "😂 — ¿Cómo se llama el campeón de buceo japonés?\n— Tokofondo.",
        "😂 — ¿Qué hace una abeja en el gimnasio?\n— ¡Zum-ba!",
        "😂 — ¿Cuál es el colmo de un electricista?\n— Que su mujer se llame Luz y sus hijos Luces.",
        "😂 — ¿Qué le dice un árbol a otro?\n— ¡Nos vemos en el bosque!",
        "😂 — ¿Por qué los pájaros no usan Facebook?\n— Porque ya tienen Twitter.",
        "😂 — ¿Cómo se dice 'espejo' en chino?\n— Ahí te va.",
        "😂 — ¿Qué le dice un techo a otro?\n— Techo de menos.",
        "😂 — ¿Qué hace una persona con un sobre de azúcar en la oreja?\n— Escuchando música dulce.",
        "😂 — ¿Cuál es el baile favorito del tomate?\n— La salsa.",
        "😂 — ¿Qué le dice una pared a otra?\n— Nos vemos en la esquina.",
        "😂 — ¿Por qué los libros de matemáticas se suicidaron?\n— Porque tenían demasiados problemas.",
        "😂 — ¿Qué le dice 0 al 8?\n— Bonito cinturón.",
        "😂 — ¿Cómo se llama el perro de los japoneses?\n— Shih Tzu.",
        "😂 — ¿Qué le dice un pez a otro?\n— ¿Qué haces? — Nada."
      ]

      const random = chistes[Math.floor(Math.random() * chistes.length)]

      await sock.sendMessage(msg.chat, {
        text: `😂 *UN CHISTE PARA TODOS* 😂\n\n${random}`
      }, { quoted: msg })

      await msg.react("😂")
    } catch (err) {
      console.error("❌ Error en chiste:", err)
      msg.reply("《✧》 Se me olvidó el chiste 😅")
    }
  }
}