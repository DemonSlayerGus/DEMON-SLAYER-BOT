import db from "#db"

// Función auxiliar para leer el saldo del usuario
function leerSaldo(user) {
  const wallet = user.money || user.coins || user.wallet || user.monedas || 0
  const bank = user.bank || user.banco || user.diamonds || 0
  return { wallet, bank, total: wallet + bank }
}

// Función para guardar los cambios en el usuario
async function guardarSaldo(user, chatId, senderId, nuevoWallet, nuevoBanco, db) {
  if (user.money !== undefined) user.money = nuevoWallet
  else if (user.coins !== undefined) user.coins = nuevoWallet
  else if (user.wallet !== undefined) user.wallet = nuevoWallet
  else user.monedas = nuevoWallet

  if (user.bank !== undefined) user.bank = nuevoBanco
  else if (user.banco !== undefined) user.banco = nuevoBanco
  else user.diamonds = nuevoBanco

  if (user.money !== undefined) await db.updateChatUser(chatId, senderId, 'money', user.money)
  if (user.coins !== undefined) await db.updateChatUser(chatId, senderId, 'coins', user.coins)
  if (user.wallet !== undefined) await db.updateChatUser(chatId, senderId, 'wallet', user.wallet)
  if (user.monedas !== undefined) await db.updateChatUser(chatId, senderId, 'monedas', user.monedas)

  if (user.bank !== undefined) await db.updateChatUser(chatId, senderId, 'bank', user.bank)
  if (user.banco !== undefined) await db.updateChatUser(chatId, senderId, 'banco', user.banco)
  if (user.diamonds !== undefined) await db.updateChatUser(chatId, senderId, 'diamonds', user.diamonds)
}

export default {
  command: ["usar", "utilizar", "dedicara"],
  category: "rpg",
  run: async ({ msg, sock, args }) => {
    try {
      const chatId = msg.chat
      const senderId = msg.sender
      const user = await db.getChatUser(chatId, senderId)
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const settings = await db.getSettings(botId)
      const moneda = settings.currency || "moras"
      const objetoId = args[0]?.toLowerCase().trim()

      if (!objetoId) {
        return msg.reply("《✧》 Dime qué quieres usar\n> Ejemplo: .usar corazon @alguien\n> Mira tus cosas: .inventario")
      }

      // Verificar inventario
      if (!user.inventario || !Array.isArray(user.inventario) || user.inventario.length === 0) {
        return msg.reply("《✧》 No tienes nada en tu inventario 😔\n> Compra algo: .tienda")
      }

      // Buscar el objeto (ignorando tildes)
      const normalizado = objetoId.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const indice = user.inventario.findIndex(item => {
        const itemId = item.id.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return itemId === normalizado
      })

      if (indice === -1) {
        return msg.reply(`《✧》 No tienes ese objeto 😔\n> Revisa con: .inventario`)
      }

      const objeto = user.inventario[indice]

      // Obtener destinatario si lo hay
      let destinatario = null
      let mencionados = []
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        mencionados = msg.message.extendedTextMessage.contextInfo.mentionedJid
      }
      if (msg.quoted) {
        destinatario = msg.quoted.sender || msg.quoted.key?.participant || msg.quoted.key?.remoteJid
      }
      if (mencionados.length > 0) {
        destinatario = mencionados[0]
      }

      const numTu = senderId.split('@')[0]
      const numDest = destinatario ? destinatario.split('@')[0] : null
      let mensaje = ""
      let gastarObjeto = true

      // ⚡ EFECTOS DE CADA OBJETO
      switch (objeto.id) {
        // 💖 DEDICATORIAS
        case "corazon":
          if (!destinatario) return msg.reply("《✧》 ¿Para quién es? Menciona o responde a alguien\n> .usar corazon @ella")
          mensaje = `❤️ *DEDICATORIA DE CORAZÓN* ❤️

> @${numTu} te dedica todo su cariño con este corazón 💌
> Para: @${numDest}

> ¡Que sepan que los quieres! 💖`
          break

        case "flor":
        case "rosa":
          if (!destinatario) return msg.reply("《✧》 ¿Para quién es la flor? Menciona a alguien")
          const emojiFlor = objeto.id === "rosa" ? "🌹" : "🌸"
          mensaje = `${emojiFlor} *UN DETALLE PARA TI* ${emojiFlor}

> @${numTu} te regala esta belleza 🌷
> Para: @${numDest}

> Con todo el cariño del mundo 💕`
          break

        case "chocolate":
          if (!destinatario) return msg.reply("《✧》 ¿Para quién es el chocolate? Menciona a alguien")
          mensaje = `🍫 *UN DULCE DETALLE* 🍫

> @${numTu} te envía estas delicias para endulzar el día 🍬
> Para: @${numDest}

> ¡Que lo disfrutes! 😋`
          break

        case "osito":
          if (!destinatario) return msg.reply("《✧》 ¿Para quién es el osito? Menciona a alguien")
          mensaje = `🧸 *UN ABRAZO SUAVE* 🧸

> @${numTu} te manda un abrazo enorme con este osito 🫂
> Para: @${numDest}

> ¡Te quiero mucho! 💛`
          break

        case "anillo":
          if (!destinatario) return msg.reply("《✧》 ¿Para quién es el anillo? Menciona a alguien")
          mensaje = `💍 *ANILLO DE PROMESA* 💍

> @${numTu} te entrega este anillo como símbolo de compromiso 💞
> Para: @${numDest}

> ¿Aceptas? 💌`
          break

        // 🛡️ PROTECCIÓN
        case "escudo":
          user.escudoActivo = Date.now() + (3 * 24 * 60 * 60 * 1000) // 3 días
          await db.updateChatUser(chatId, senderId, 'escudoActivo', user.escudoActivo)
          mensaje = `🛡️ *ESCUDO ACTIVADO* 🛡️

> ¡Estás protegido por 3 días!
> Nadie podrá robarte ni hacerte perder monedas ✨`
          break

        case "casco":
          user.cascoActivo = Date.now() + (2 * 24 * 60 * 60 * 1000) // 2 días
          await db.updateChatUser(chatId, senderId, 'cascoActivo', user.cascoActivo)
          mensaje = `⛑️ *CASCO DE SEGURIDAD* ⛑️

> Activado por 2 días.
> Si pierdes algo, solo pierdes la mitad 💪`
          break

        case "armadura":
          user.escudoActivo = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días
          user.armaduraActiva = true
          await db.updateChatUser(chatId, senderId, 'escudoActivo', user.escudoActivo)
          await db.updateChatUser(chatId, senderId, 'armaduraActiva', user.armaduraActiva)
          mensaje = `🥷 *ARMADURA NINJA EQUIPADA* 🥷

> ¡Protección total por 7 días!
> Robos bloqueados, pérdidas reducidas al mínimo 🛡️⚔️`
          break

        // 🍀 SUERTE Y ENERGÍA
        case "estrella":
          user.suerteActiva = Date.now() + (24 * 60 * 60 * 1000) // 24h
          await db.updateChatUser(chatId, senderId, 'suerteActiva', user.suerteActiva)
          mensaje = `⭐ *ESTRELLA DE LA SUERTE* ⭐

> ¡Tu suerte está activa por 24 horas! 🍀
> Más ganancias en juegos, trabajo y apuestas ✨`
          break

        case "amuleto":
          user.amuletoActivo = Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 días
          await db.updateChatUser(chatId, senderId, 'amuletoActivo', user.amuletoActivo)
          mensaje = `🍀 *AMULETO DE PROTECCIÓN* 🍀

> Aleja la mala suerte por 5 días.
> Menos fallos, más aciertos ✨`
          break

        case "sol":
          const saldoSol = leerSaldo(user)
          const gananciaSol = Math.floor(saldoSol.total * 0.1) || 10
          let { wallet: wSol, bank: bSol } = saldoSol
          wSol += gananciaSol
          await guardarSaldo(user, chatId, senderId, wSol, bSol, db)
          mensaje = `☀️ *ENERGÍA DEL SOL* ☀️

> El sol te da un 10% extra de tus monedas 🌞
> Ganaste: +${gananciaSol} ${moneda}
> ¡A brillar! ✨`
          break

        // 🎰 COFRE SORPRESA — ¡MONEDAS ALEATORIAS!
        case "cofre":
          const resultados = [
            { tipo: "grande", min: 100, max: 300, texto: "¡UN TESORO INCREÍBLE! 💎" },
            { tipo: "medio", min: 40, max: 99, texto: "¡Un buen botín! 📦" },
            { tipo: "pequeño", min: 10, max: 39, texto: "Algo hay, poco pero es mío 🫙" },
            { tipo: "malo", min: -30, max: -5, texto: "¡Caíste en una trampa! 🕳️" },
            { tipo: "doble", min: 0, max: 0, texto: "¡TE SALIÓ OTRO COFRE! 🎁" }
          ]
          const azar = Math.random()
          let resultado
          if (azar < 0.1) resultado = resultados[4] // 10% otro cofre
          else if (azar < 0.3) resultado = resultados[0] // 20% grande
          else if (azar < 0.6) resultado = resultados[1] // 30% medio
          else if (azar < 0.85) resultado = resultados[2] // 25% pequeño
          else resultado = resultados[3] // 15% malo

          const ganancia = resultado.min + Math.floor(Math.random() * (resultado.max - resultado.min + 1))
          const saldoCofre = leerSaldo(user)
          let { wallet: wCofre, bank: bCofre } = saldoCofre

          if (resultado.tipo === "doble") {
            user.inventario.push({ id: "cofre", nombre: "📦 Cofre sorpresa", fecha: new Date().toISOString() })
            mensaje = `🎰 *COFRE SORPRESA* 🎰

> ${resultado.texto}
> ¡Te salió otro cofre adentro! 🎁
> Tienes uno más para abrir 👀`
            gastarObjeto = false // No se gasta, se devuelve
          } else {
            wCofre += ganancia
            if (wCofre < 0) {
              bCofre += wCofre
              wCofre = 0
            }
            if (bCofre < 0) bCofre = 0
            await guardarSaldo(user, chatId, senderId, wCofre, bCofre, db)

            const signo = ganancia >= 0 ? "+" : ""
            mensaje = `🎰 *ABRIENDO EL COFRE...* 🎰

> ${resultado.texto}
> Ganancia: ${signo}${ganancia} ${moneda}
> Tu saldo: ${wCofre + bCofre} ${moneda}`
          }
          break

        // 🧪 POCIÓN DE EXPERIENCIA
        case "pocion":
          user.xpMultiplicador = Date.now() + (24 * 60 * 60 * 1000) // 24h x2 XP
          await db.updateChatUser(chatId, senderId, 'xpMultiplicador', user.xpMultiplicador)
          mensaje = `🧪 *POCIÓN DE EXPERIENCIA* 🧪

> ¡Duplicas tu experiencia por 24 horas! ⚡
> Todo lo que hagas te dará el doble de XP 📈`
          break

        default:
          mensaje = `📦 *Usaste: ${objeto.nombre}*\n> ¡Listo! ✅`
          break
      }

      // Quitar objeto del inventario si se gastó
      if (gastarObjeto) {
        user.inventario.splice(indice, 1)
        await db.updateChatUser(chatId, senderId, 'inventario', user.inventario)
      }

      // Enviar mensaje
      await sock.sendMessage(chatId, {
        text: mensaje,
        mentions: destinatario ? [senderId, destinatario] : [senderId]
      }, { quoted: msg })

      await msg.react("✅")

    } catch (err) {
      console.error("❌ Error al usar objeto:", err)
      msg.reply("《✧》 Algo salió mal al usar el objeto 😔")
    }
  }
}
