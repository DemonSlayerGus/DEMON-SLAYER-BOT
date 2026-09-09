import db from "#db"

const productos = [
  // 💖 Detalles
  { id: "corazon", nombre: "❤️ Corazón de amor", precio: 50, desc: "Para dedicar a alguien especial" },
  { id: "flor", nombre: "🌹 Flor eterna", precio: 30, desc: "Un detalle bonito y elegante" },
  { id: "rosa", nombre: "🌹 Rosa roja", precio: 45, desc: "Para conquistar a alguien 💘" },
  { id: "chocolate", nombre: "🍫 Caja de chocolates", precio: 60, desc: "Dulce detalle para endulzar el día" },
  { id: "osito", nombre: "🧸 Osito de peluche", precio: 80, desc: "Un abrazo suave y tierno" },
  { id: "anillo", nombre: "💍 Anillo de promesa", precio: 250, desc: "Para sellar una amistad o amor 💍" },
  { id: "corazongrande", nombre: "💖 Corazón gigante", precio: 120, desc: "Para demostrar amor enorme" },
  { id: "bombones", nombre: "🍬 Bombones surtidos", precio: 55, desc: "Para compartir con el grupo" },

  // 🍀 Suerte y energía
  { id: "estrella", nombre: "⭐ Estrella de la suerte", precio: 80, desc: "Te da buena suerte por 24h" },
  { id: "fuego", nombre: "🔥 Fuego de la pasión", precio: 100, desc: "Para animar el chat con energía" },
  { id: "amuleto", nombre: "🍀 Amuleto de protección", precio: 130, desc: "Aleja la mala suerte" },
  { id: "luna", nombre: "🌙 Luna plateada", precio: 180, desc: "Sabiduría y calma en tus decisiones" },
  { id: "sol", nombre: "☀️ Sol dorado", precio: 200, desc: "Energía y vitalidad extra" },
  { id: "arcoiris", nombre: "🌈 Arcoíris de colores", precio: 220, desc: "Trae alegría y armonía al grupo" },

  // 🛡️ Defensa y protección
  { id: "escudo", nombre: "🛡️ Escudo protector", precio: 150, desc: "Te protege de robos y ataques" },
  { id: "casco", nombre: "⛑️ Casco de seguridad", precio: 120, desc: "Reduce pérdidas al perder monedas" },
  { id: "armadura", nombre: "🥷 Armadura ninja", precio: 350, desc: "Protección completa contra robos" },
  { id: "muro", nombre: "🧱 Muro impenetrable", precio: 280, desc: "Nadie puede robarte por 3 días" },

  // 🎁 Objetos especiales
  { id: "pocion", nombre: "🧪 Poción de experiencia", precio: 200, desc: "Duplica tu experiencia por 24h" },
  { id: "llave", nombre: "🗝️ Llave misteriosa", precio: 300, desc: "Desbloquea zonas secretas del grupo" },
  { id: "cofre", nombre: "📦 Cofre sorpresa", precio: 175, desc: "¡Puede salirte algo bueno o malo! 🎰" },
  { id: "pergamino", nombre: "📜 Pergamino antiguo", precio: 250, desc: "Aprende un comando especial" },
  { id: "mascota", nombre: "🐾 Mascota virtual", precio: 400, desc: "Te acompaña y da bonificaciones" },

  // 💎 Lujo y estatus
  { id: "corona", nombre: "👑 Corona real", precio: 800, desc: "Eres el rey/reina del grupo 👑" },
  { id: "diamante", nombre: "💎 Diamante puro", precio: 500, desc: "La joya más valiosa" },
  { id: "trofeo", nombre: "🏆 Trofeo de campeón", precio: 600, desc: "Para presumir tus logros" },
  { id: "globo", nombre: "🎈 Globo personalizado", precio: 75, desc: "Un mensaje que todos verán" },
  { id: "confeti", nombre: "🎊 Cañón de confeti", precio: 90, desc: "¡Celebra con todos!" }
]

export default {
  command: ["tienda", "comprar", "shop"],
  category: "rpg",
  run: async ({ msg, sock, args, command }) => {
    try {
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const settings = await db.getSettings(botId)
      const moneda = settings.currency || "moras"
      const user = await db.getChatUser(msg.chat, msg.sender)

      // ✅ Leer igual que en balance
      const wallet = user.money || user.coins || user.wallet || user.monedas || 0
      const bank = user.bank || user.banco || user.diamonds || 0
      const saldoTotal = wallet + bank

      // Si solo escribes .tienda → mostrar lista completa
      if (!args[0] || (command === "tienda" && !["comprar", "shop"].includes(args[0]?.toLowerCase()))) {
        let lista = `🛒 *TIENDA DEL GRUPO* — Tu saldo: ${saldoTotal} ${moneda}\n\n`
        
        // Agrupar por categorías para que se vea ordenado
        lista += "💖 *DETALLES Y REGALOS*\n"
        productos.filter(p => [
          "corazon", "flor", "rosa", "chocolate", "osito", "anillo", "corazongrande", "bombones"
        ].includes(p.id)).forEach(p => {
          lista += `${p.nombre} — ${p.precio} ${moneda}\n> ${p.desc}\n`
        })

        lista += "\n🍀 *SUERTE Y ENERGÍA*\n"
        productos.filter(p => [
          "estrella", "fuego", "amuleto", "luna", "sol", "arcoiris"
        ].includes(p.id)).forEach(p => {
          lista += `${p.nombre} — ${p.precio} ${moneda}\n> ${p.desc}\n`
        })

        lista += "\n🛡️ *PROTECCIÓN*\n"
        productos.filter(p => [
          "escudo", "casco", "armadura", "muro"
        ].includes(p.id)).forEach(p => {
          lista += `${p.nombre} — ${p.precio} ${moneda}\n> ${p.desc}\n`
        })

        lista += "\n🎁 *ESPECIALES*\n"
        productos.filter(p => [
          "pocion", "llave", "cofre", "pergamino", "mascota"
        ].includes(p.id)).forEach(p => {
          lista += `${p.nombre} — ${p.precio} ${moneda}\n> ${p.desc}\n`
        })

        lista += "\n💎 *ESTATUS Y LUJO*\n"
        productos.filter(p => [
          "corona", "diamante", "trofeo", "globo", "confeti"
        ].includes(p.id)).forEach(p => {
          lista += `${p.nombre} — ${p.precio} ${moneda}\n> ${p.desc}\n`
        })

        lista += `\n💡 Escribe: *.comprar [id]*\n> Ejemplo: *.comprar rosa*\n> Ver saldo: *.balance*`
        return msg.reply(lista)
      }

      // Detectar compra
      let idProducto = ""
      if (command === "comprar") {
        idProducto = args[0]?.toLowerCase() || ""
      } else if (["comprar", "shop"].includes(args[0]?.toLowerCase())) {
        idProducto = args[1]?.toLowerCase() || ""
      }

      if (!idProducto) {
        return msg.reply("《✧》 Dime qué quieres comprar\n> Ejemplo: *.comprar rosa*")
      }

      // Buscar producto
      const prod = productos.find(p => p.id === idProducto)
      if (!prod) {
        return msg.reply(`《✧》 Producto no encontrado 😔\n> Revisa el nombre: *.comprar ${idProducto}*\n> Usa *.tienda* para ver todos`)
      }

      // Verificar saldo
      if (saldoTotal < prod.precio) {
        return msg.reply(`《✧》 No tienes suficientes ${moneda} 😔

> 📦 Producto: ${prod.nombre}
> 💸 Costo: ${prod.precio} ${moneda}
> 💰 Tienes: ${saldoTotal} ${moneda}
> ❌ Te faltan: ${prod.precio - saldoTotal} ${moneda}`)
      }

      // Descontar: primero billetera, luego banco
      let nuevoWallet = wallet
      let nuevoBanco = bank
      let gasto = prod.precio

      if (nuevoWallet >= gasto) {
        nuevoWallet -= gasto
      } else {
        gasto -= nuevoWallet
        nuevoWallet = 0
        nuevoBanco -= gasto
      }

      // Guardar con los mismos nombres que lee tu balance
      if (user.money !== undefined) user.money = nuevoWallet
      else if (user.coins !== undefined) user.coins = nuevoWallet
      else if (user.wallet !== undefined) user.wallet = nuevoWallet
      else user.monedas = nuevoWallet

      if (user.bank !== undefined) user.bank = nuevoBanco
      else if (user.banco !== undefined) user.banco = nuevoBanco
      else user.diamonds = nuevoBanco

      // Agregar al inventario
      if (!user.inventario) user.inventario = []
      user.inventario.push({ 
        id: prod.id, 
        nombre: prod.nombre, 
        fecha: new Date().toISOString() 
      })

      // Actualizar en la base de datos
      if (user.money !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'money', user.money)
      if (user.coins !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
      if (user.wallet !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'wallet', user.wallet)
      if (user.monedas !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'monedas', user.monedas)

      if (user.bank !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'bank', user.bank)
      if (user.banco !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'banco', user.banco)
      if (user.diamonds !== undefined) await db.updateChatUser(msg.chat, msg.sender, 'diamonds', user.diamonds)

      await db.updateChatUser(msg.chat, msg.sender, 'inventario', user.inventario)

      // Mensaje de confirmación
      await sock.sendMessage(msg.chat, {
        text: `✅ *COMPRA REALIZADA* 🛍️

> 📦 Producto: ${prod.nombre}
> 💸 Costo: ${prod.precio} ${moneda}
> 💵 Billetera: ${nuevoWallet.toLocaleString()} ${moneda}
> 🏦 Banco: ${nuevoBanco.toLocaleString()} ${moneda}
> 📊 Total: ${(nuevoWallet + nuevoBanco).toLocaleString()} ${moneda}

> ¡Gracias por comprar! 🎉`
      }, { quoted: msg })

      await msg.react("✅")

    } catch (err) {
      console.error("❌ Error en tienda:", err)
      msg.reply("《✧》 La tienda está cerrada por mantenimiento 😅")
    }
  }
}
