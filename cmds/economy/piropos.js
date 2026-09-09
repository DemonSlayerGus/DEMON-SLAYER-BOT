export default {
  command: ["piropo", "piropos", "dedicar", "amor"],
  category: "diversion",
  alias: ["piropo", "piropos", "dedicar"],
  run: async ({ msg, sock }) => {
    try {
      const piropos = [
        "🌹 Eres como el sol: aunque todos lo vean, yo solo me quedo mirándote a ti.",
        "😍 Si la belleza fuera tiempo, tú serías la eternidad.",
        "💛 Si fueras un pecado, yo me quedaría en el infierno por toda la eternidad.",
        "🌎 El mundo es grande, pero mi corazón es pequeño y solo te quiere a ti.",
        "✨ Eres el sueño más bonito que la vida me ha permitido cumplir.",
        "🍬 Si fueras un dulce, serías el más rico de todo el mundo.",
        "📸 No sé qué es lo que me haces, pero cada vez que te veo me sacas una sonrisa sin querer.",
        "🌙 Eres la luna que ilumina mis noches y el sol que me despierta cada mañana.",
        "💌 Si te diera un beso por cada vez que pienso en ti, no te dejaría ni respirar.",
        "💖 Tú llegaste como una lluvia suave y te quedaste como un huracán en mi corazón.",
        "👀 Tus ojos son como dos estrellas que me guían cuando estoy perdido.",
        "🎨 Si fueras un color, serías el más brillante de todo el arcoíris.",
        "🌹 No busques la perfección, porque ya la encontraste en ti.",
        "⏳ Si pudiera pedirle un deseo al tiempo, sería detenerlo cuando estoy contigo.",
        "☁️ Eres mi lugar favorito en todo el mundo.",
        "💫 Dicen que el amor es ciego, pero al mirarte veo todo mucho más claro.",
        "🍎 Eres la manzana prohibida que yo nunca me cansaría de probar.",
        "🎵 Eres mi canción favorita, y aunque la repita mil veces, nunca me canso de escucharte.",
        "🌊 Eres como el mar: inmenso, hermoso y con una profundidad que quiero conocer.",
        "💬 Si te dijera lo mucho que me gustas, no nos alcanzaría el tiempo.",
        "🔥 Tienes una sonrisa que enciende el mundo entero.",
        "📝 Eres la historia más bonita que el destino escribió en mi vida.",
        "🌈 Después de la tormenta, siempre sale el sol... y tú eres mi sol.",
        "💎 Eres como un diamante: raro, valioso y brillante.",
        "🌻 Eres mi luz cuando todo se ve oscuro.",
        "🍀 Eres la suerte que nunca creí merecer.",
        "✈️ Si tuviera que viajar hasta el fin del mundo por un beso tuyo, ya estaría de camino.",
        "💭 Eres el primer pensamiento que tengo al despertar y el último al dormir.",
        "🌷 Si fueras una flor, serías la más hermosa de todo el jardín.",
        "⚡ Solo con mirarme me has robado el corazón.",
        "🎁 Eres el regalo más bonito que me ha dado la vida.",
        "🌍 Si el mundo se acabara mañana, hoy te diría todo lo que siento por ti.",
        "💓 Mi corazón late más rápido cada vez que te veo.",
        "🌟 Eres como un ángel que cayó del cielo para alegrarme la vida.",
        "🔐 Tienes la llave de mi corazón y no pienso pedirte que la devuelvas.",
        "🎆 Eres como fuegos artificiales: iluminas todo con solo estar.",
        "📖 Si mi vida fuera un libro, tú serías el capítulo más bonito.",
        "🍂 Como en otoño caen las hojas, así caigo yo por ti.",
        "💃 Eres la melodía que mi corazón siempre quiso bailar.",
        "🌅 Cada amanecer me recuerda lo hermoso que es tenerte en mi vida.",
        "🧭 Eres mi brújula, porque sin ti me siento perdido.",
        "🍇 Si fueras un fruto, serías el más dulce de todos los viñedos.",
        "🗺️ He recorrido muchos caminos, y el mejor de todos es el que me lleva a ti.",
        "🎯 Si eres mi objetivo, ya voy corriendo a alcanzarte.",
        "💧 Eres como el agua: necesaria para vivir y hermosa de mirar.",
        "🎈 Mi corazón se llena de alegría cada vez que te veo.",
        "🌺 Entre todas las flores del jardín, tú eres la más bella.",
        "⚽ Eres el gol de mi vida, el triunfo que siempre soñé.",
        "🎬 Si mi vida fuera una película, tú serías la protagonista.",
        "🏠 Donde estés tú, ahí es donde quiero estar yo.",
        "🎀 Eres tan linda que hasta el sol se pone celoso cuando te ve salir.",
        "🌊 Tus ojos son tan profundos que me ahogo en ellos cada vez que me miras.",
        "🎤 Si tuviera que cantarte lo que siento, escribiría mil canciones.",
        "⏰ El tiempo vuela cuando estoy contigo, pero se detiene cuando te extraño.",
        "💌 No necesito nada más, porque contigo lo tengo todo.",
        "🌿 Eres la calma que mi alma siempre buscó.",
        "💫 Dicen que nadie es perfecto, pero tú eres la excepción que confirma la regla.",
        "☕ Eres como el café: me despiertas, me alegras el día y no quiero que se me acabe nunca.",
        "🌌 Si fueras una constelación, serías la más brillante del cielo.",
        "🧸 Eres mi abrazo favorito, el que siempre quiero volver a dar.",
        "🌧️ Aunque llueva, tú siempre eres mi sol.",
        "🎨 Eres el color que le faltaba a mi vida.",
        "📱 Eres la notificación que más me gusta recibir.",
        "🚀 Contigo hasta el fin del universo.",
        "🪐 Eres mi planeta favorito, donde siempre quiero orbitar.",
        "💡 Eres la idea más bonita que ha llegado a mi mente."
      ]

      const random = piropos[Math.floor(Math.random() * piropos.length)]
      let mensaje = `🌸 *PIROPO PARA DEDICAR* 🌸\n\n${random}`

      // ✅ Si responde a un mensaje, se lo dedicamos a esa persona
      if (msg.quoted) {
        const quien = msg.quoted.sender || msg.quoted.key?.remoteJid || msg.quoted.key?.participant
        if (quien) {
          mensaje = `🌸 *PIROPO PARA DEDICAR* 🌸\n\n${random}\n\n💌 Para ti @${quien.split('@')[0]}`
        }
      }

      // ✅ Si hay menciones en el mensaje, se lo dedicamos a la primera
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        const mencionado = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
        mensaje = `🌸 *PIROPO PARA DEDICAR* 🌸\n\n${random}\n\n💌 Para ti @${mencionado.split('@')[0]}`
      }

      await sock.sendMessage(msg.chat, {
        text: mensaje,
        mentions: msg.quoted ? [msg.quoted.sender || msg.quoted.key?.remoteJid || msg.quoted.key?.participant].filter(Boolean) : 
                  msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
      }, { quoted: msg })

      await msg.react("💕")

    } catch (err) {
      console.error("❌ Error en piropos:", err)
      return msg.reply("《✧》 Ocurrió un error 😔")
    }
  }
}