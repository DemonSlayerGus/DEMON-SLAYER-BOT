import db from "#db"
import fs from 'fs'

global.math = global.math || {}

const limits = {
  facil: 10,
  medio: 50,
  dificil: 90,
  imposible: 120,
  imposible2: 200
}

const generateRandomNumber = (max) => Math.floor(Math.random() * max) + 1
const getOperation = () => ['+', '-', '*', '/'][Math.floor(Math.random() * 4)]

const operacionesAvanzadas = [
  (a, b) => ({ visible: `√(${a}² + ${b}³) ÷ ${Math.max(2, b % 10)}`, eval: `Math.sqrt((${a}**2 + ${b}**3)) / ${Math.max(2, b % 10)}` }),
  (a, b) => ({ visible: `(${a}³ - ${b}²) ÷ ${Math.max(2, a % 7)}`, eval: `((${a}**3 - ${b}**2)) / ${Math.max(2, a % 7)}` }),
  (a, b) => ({ visible: `√(${a} × ${b}) + ${a}`, eval: `Math.sqrt(${a} * ${b}) + ${a}` }),
  (a, b) => ({ visible: `(${a}² + ${b}²) ÷ ${Math.max(2, b)}`, eval: `((${a}**2 + ${b}**2)) / ${Math.max(2, b)}` })
]

const generarProblema = (dificultad) => {
  const maxLimit = limits[dificultad] || 30
  const num1 = generateRandomNumber(maxLimit)
  const num2 = generateRandomNumber(maxLimit)

  if (['dificil', 'imposible', 'imposible2'].includes(dificultad)) {
    const expr = operacionesAvanzadas[Math.floor(Math.random() * operacionesAvanzadas.length)](num1, num2)
    const resultado = eval(expr.eval)
    return {
      problema: expr.visible,
      resultado: resultado.toFixed(2)
    }
  }

  const operador = getOperation()
  const resultado = eval(`${num1} ${operador} ${num2}`)
  const simbolo = operador === '*'? '×' : operador === '/'? '÷' : operador
  return {
    problema: `${num1} ${simbolo} ${num2}`,
    resultado: operador!== '/'? resultado : resultado.toFixed(2)
  }
}

async function run({ msg, sock: client, args, command, text, usedPrefix: prefix }) {
  const chatId = msg.chat
  const db2 = await db.getChat(msg.chat)
  const user = await db.getUser(msg.sender)
  const juego = global.math[chatId]

  if (db2.adminonly ||!db2.rpg) {
    return client.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })
  }

  if (command === 'responder') {
    if (!juego?.juegoActivo) return

    const quotedId = msg.quoted?.key?.id || msg.quoted?.id || msg.quoted?.stanzaId
    if (quotedId!== juego.problemMessageId) return

    const respuestaUsuario = args[0]
    if (!respuestaUsuario) {
      return client.sendMessage(chatId, { text: `《✤》 Debes escribir tu respuesta.` }, { quoted: msg })
    }

    const respuestaCorrecta = juego.respuesta
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const primaryBotId = db2.primaryBot

    if (!primaryBotId || primaryBotId === botId) {
      if (respuestaUsuario === respuestaCorrecta) {
        const expaleatorio = Math.floor(Math.random() * 50) + 10
        user.exp += expaleatorio
        await db.updateUser(msg.sender, 'exp', user.exp)
        clearTimeout(juego.tiempoLimite)
        delete global.math[chatId]
        return client.sendMessage(chatId, { text: `✎ Respuesta correcta.\n> *Ganaste ›* ${expaleatorio} Exp` }, { quoted: msg })
      } else {
        juego.intentos += 1
        if (juego.intentos >= 3) {
          clearTimeout(juego.tiempoLimite)
          delete global.math[chatId]
          return client.sendMessage(chatId, { text: '《✤》 Te quedaste sin intentos. Suerte a la próxima.' }, { quoted: msg })
        } else {
          const intentosRestantes = 3 - juego.intentos
          return client.sendMessage(chatId, { text: `《✤》 Respuesta incorrecta, te quedan ${intentosRestantes} intentos.` }, { quoted: msg })
        }
      }
    }
    return
  }

  if (command === 'math') {
    if (juego?.juegoActivo) {
      return client.sendMessage(chatId, { text: '✿ Ya hay un juego activo. Espera a que termine.' }, { quoted: msg })
    }

    const dificultad = args[0]?.toLowerCase()
    if (!limits[dificultad]) {
      return client.sendMessage(chatId, { text: '❀ Especifica una dificultad válida: *facil, medio, dificil, imposible, imposible2*' }, { quoted: msg })
    }

    const { problema, resultado } = generarProblema(dificultad)
    const problemMessage = await client.sendMessage(chatId, { text: `「✎」 Tienes 1 minuto para resolver:\n\n> ❖ *${problema}*\n\n_✿ Usa » *${prefix}responder* para responder!_` }, { quoted: msg })

    global.math[chatId] = {
      juegoActivo: true,
      problema,
      respuesta: resultado.toString(),
      intentos: 0,
      timeout: Date.now() + 60000,
      problemMessageId: problemMessage.key?.id,
      tiempoLimite: setTimeout(() => {
        if (global.math[chatId]?.juegoActivo) {
          delete global.math[chatId]
          client.sendMessage(chatId, { text: '《✤》 Tiempo agotado. El juego ha terminado.' })
        }
      }, 60000)
    }
  }
}

export default {
  command: ['math', 'matematicas', 'responder'],
  category: 'rpg',
  run
}