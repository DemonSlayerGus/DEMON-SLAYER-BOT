import db from "#db"

export default {
  command: ['acertijo'],
  category: 'economy',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings?.currency || 'Coins'

    const user = await db.getChatUser(msg.chat, msg.sender)
    const now = Date.now()

    // Cooldown de 5 minutos
    if (user.acertijoCooldown > now) {
      const remaining = user.acertijoCooldown - now
      return sock.sendMessage(msg.chat, { text: `ꕥ Debes esperar *${msToTime(remaining)}* para usar otro acertijo.` }, { quoted: msg })
    }

    const acertijo = pickRandom(acertijos)
    const RECOMPENSA = 2000

    const preguntaMsg = await sock.sendMessage(msg.chat, {
      text: `「💰」 *ACERTIJO - ${RECOMPENSA} ${monedas}*\n\n> ${acertijo.pregunta}\n\n_Responde a este mensaje en 60 segundos._`
    }, { quoted: msg })

    // --- FIX: Esperar respuesta con listener ---
    let respondio = false
    const timeout = setTimeout(async () => {
      if (!respondio) {
        await sock.sendMessage(msg.chat, {
          text: `「⏰」 *TIEMPO AGOTADO*\n\nLa respuesta era: *${acertijo.respuesta}*`
        }, { quoted: preguntaMsg })
        user.acertijoCooldown = now + 5 * 60000
        await db.updateChatUser(msg.chat, msg.sender, 'acertijoCooldown', user.acertijoCooldown)
      }
    }, 60000) // 60 segundos

    const handler = async (m) => {
      if (!m.messages) return
      const message = m.messages[0]
      if (!message.message || message.key.remoteJid!== msg.chat) return
      
      const sender = message.key.participant || message.key.remoteJid
      if (sender!== msg.sender) return

      const body = message.message.conversation || message.message.extendedTextMessage?.text || ''
      if (!body) return

      respondio = true
      clearTimeout(timeout)
      sock.ev.off('messages.upsert', handler)

      const respuestaUser = body.toLowerCase().trim()
      const respuestaCorrecta = acertijo.respuesta.toLowerCase().trim()

      if(respuestaUser.includes(respuestaCorrecta) || respuestaCorrecta.includes(respuestaUser)){
        user.coins += RECOMPENSA
        user.acertijoCooldown = now + 5 * 60000

        await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
        await db.updateChatUser(msg.chat, msg.sender, 'acertijoCooldown', user.acertijoCooldown)

        await sock.sendMessage(msg.chat, {
          text: `「✅」 *¡CORRECTO!*\n\nꕥ Ganaste *${RECOMPENSA.toLocaleString()} ${monedas}* 💸\nRespuesta: *${acertijo.respuesta}*`
        }, { quoted: message })

      } else {
        user.acertijoCooldown = now + 5 * 60000
        await db.updateChatUser(msg.chat, msg.sender, 'acertijoCooldown', user.acertijoCooldown)

        await sock.sendMessage(msg.chat, {
          text: `「❌」 *INCORRECTO*\n\nLa respuesta era: *${acertijo.respuesta}*\nSuerte la próxima!`
        }, { quoted: message })
      }
    }

    sock.ev.on('messages.upsert', handler)
  },
}

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  minutes = minutes < 10? '0' + minutes : minutes
  seconds = seconds < 10? '0' + seconds : seconds
  if (minutes === '00') return `${seconds} segundo${seconds > 1? 's' : ''}`
  return `${minutes} minuto${minutes > 1? 's' : ''}, ${seconds} segundo${seconds > 1? 's' : ''}`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const acertijos = [
  { pregunta: "¿Qué cosa sube y nunca baja?", respuesta: "la edad" },
  { pregunta: "¿Qué tiene una cabeza pero no tiene cerebro?", respuesta: "un alfiler" },
  { pregunta: "¿Qué cosa camina sin pies y llora sin ojos?", respuesta: "la nube" },
  { pregunta: "¿Qué sube lleno y baja vacío?", respuesta: "el cubo" },
  { pregunta: "¿Qué cosa entre más le quitas más grande es?", respuesta: "el hueco" },
  { pregunta: "¿Qué tiene llaves pero no abre puertas?", respuesta: "el piano" },
  { pregunta: "¿Qué cosa se rompe sin tocarla?", respuesta: "el silencio" },
  { pregunta: "¿Qué tiene cara y manos pero no tiene cuerpo?", respuesta: "el reloj" },
  { pregunta: "¿Qué cosa siempre va hacia adelante pero nunca retrocede?", respuesta: "el tiempo" },
  { pregunta: "¿Qué cosa está siempre delante de ti pero nunca puedes verla?", respuesta: "el futuro" }
]