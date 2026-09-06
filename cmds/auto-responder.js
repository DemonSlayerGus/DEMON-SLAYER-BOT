import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const NOMBRE_BOT = 'max'
const MAX_MENSAJES = 15 // Recuerda 15 mensajes por chat
const RUTA_MEMORIA = './memoria.json'

// Cargar memoria al iniciar
let historial = {}
if (fs.existsSync(RUTA_MEMORIA)) {
  historial = JSON.parse(fs.readFileSync(RUTA_MEMORIA, 'utf-8'))
}

// Función para guardar memoria
function guardarMemoria() {
  fs.writeFileSync(RUTA_MEMORIA, JSON.stringify(historial, null, 2))
}

export default {
  before: async ({ msg, sock }) => {
    if (msg.key.fromMe) return

    const chatId = msg.key.remoteJid
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
    const nombreUsuario = msg.pushName || 'bro'
    if (!text) return

    // Inicializa historial del chat
    if (!historial[chatId]) historial[chatId] = []

    // Guarda el mensaje del usuario
    historial[chatId].push({ role: 'user', name: nombreUsuario, content: text })

    // Si mencionan al bot
    if (text.toLowerCase().includes(NOMBRE_BOT)) {

      await sock.sendPresenceUpdate('composing', chatId)
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))

      try {
        // Construimos el historial
        let contexto = historial[chatId].slice(-MAX_MENSAJES).map(m =>
          `${m.role === 'user'? m.name : 'Max'}: ${m.content}`
        ).join('\n')

        const prompt = `Eres Max. Eres carismático, alegre, energético y muy humano ✨😄
        Hablas como mejor amigo. Usas "brooo", "jajaja", "obviooo", "que bacano".
        TIENES MEMORIA. Recuerdas cosas que te dijeron antes.
        Si el usuario te pide "guarda que me llamo ___" lo recuerdas.
        Respuestas cortas de 1-3 líneas. Usa emojis 💫🥳🩸

        Historial de la conversación:
        ${contexto}

        Ahora responde solo como Max a lo último que dijo el Usuario. Natural.`

        const res = await fetch(`https://api.delirius.online/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`)
        const json = await res.json()

        if (!json.status) return

        let respuesta = json.data

        // Guarda la respuesta del bot
        historial[chatId].push({ role: 'assistant', content: respuesta })

        // Recorta historial para que no pese mucho
        if (historial[chatId].length > MAX_MENSAJES * 2) {
          historial[chatId] = historial[chatId].slice(-MAX_MENSAJES * 2)
        }

        guardarMemoria() // Guarda en el archivo

        await sock.sendMessage(chatId, { react: { text: '💫', key: msg.key } })

        await sock.sendMessage(chatId, {
          text: `${respuesta}`
        }, { quoted: msg })

      } catch (err) {
        console.log(err)
      }
    }
  }
}