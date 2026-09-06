import fetch from 'node-fetch'
import fs from 'fs'

const RUTA_PUNTOS = './puntos_vr.json'
let turno = {}
let puntos = {}
let votacion = {} // {chatId: {votosSi: [], votosNo: [], timer}}

const frasesCumplido = [
  '🔥 SE LA BANCO COMO LOS DIOSES',
  '💀 RESPETO POR ESA VALENTÍA',
  '😈 NADIE LO HUBIERA HECHO MEJOR',
  '⚔️ HONOR Y GLORIA PARA TI',
  '👑 REY/REINA DEL VR'
]

const frasesCastigo = [
  '🐢 LENTO COMO TORTUGA',
  '😹 CAGÓN, NO TE ANIMASTE',
  '💩 -1 DE HONOR POR MIEDOSO',
  '👻 FANTASMA QUE NO CUMPLE'
]

const penalizaciones = [
  'Manda nota de voz cantando 10s 🎤',
  'Cambia tu foto 24h 😹',
  'Escribe "soy un cagón" al grupo 💩',
  'Manda captura de tu galería random 📸',
  'Di "los amo" con voz de bebé 👶'
]

if (fs.existsSync(RUTA_PUNTOS)) {
  puntos = JSON.parse(fs.readFileSync(RUTA_PUNTOS, 'utf-8'))
}

function guardarPuntos() {
  fs.writeFileSync(RUTA_PUNTOS, JSON.stringify(puntos, null, 2))
}

function sumarPunto(user, nivel) {
  if(!puntos[user]) puntos[user] = {total: 0, normal: 0, atrevido: 0, extremo: 0}
  const pts = nivel === 'extremo'? 3 : nivel === 'atrevido'? 2 : 1
  puntos[user].total += pts
  puntos[user][nivel] += 1
  guardarPuntos()
  return pts
}

function getUser(msg) {
  return msg.key.participant || msg.key.remoteJid
}

export default {
  before: async ({ msg, sock }) => {
    if (msg.key.fromMe) return

    const chatId = msg.key.remoteJid
    const user = getUser(msg)
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
    if (!text) return

    const texto = text.toLowerCase().trim()

    // 1. VOTAR
    if(texto === 'si' || texto === 'sí') {
      if(!votacion[chatId]) return
      if(!votacion[chatId].votosSi.includes(user) &&!votacion[chatId].votosNo.includes(user)) {
        votacion[chatId].votosSi.push(user)
        await sock.sendMessage(chatId, { react: { text: '✅', key: msg.key } })
      }
      return
    }
    if(texto === 'no') {
      if(!votacion[chatId]) return
      if(!votacion[chatId].votosSi.includes(user) &&!votacion[chatId].votosNo.includes(user)) {
        votacion[chatId].votosNo.push(user)
        await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } })
      }
      return
    }

    // 2. RANKING
    if(texto === 'vr ranking' || texto === 'ranking vr') {
      let top = Object.entries(puntos).sort((a,b) => b[1].total - a[1].total).slice(0, 10)
      if(top.length === 0) return sock.sendMessage(chatId, { text: '《🩸》 Nadie ha cumplido retos aún. Sean valientes 😈' }, { quoted: msg })

      let mensaje = '🏆 *TABLA DE LOS MÁS ATREVIDOS* 🏆\n\n'
      top.forEach(([u, p], i) => {
        const medalla = i === 0? '👑' : i === 1? '🥈' : i === 2? '🥉' : '💪'
        mensaje += `${medalla} ${i+1}. @${u.split('@')[0]} - ${p.total} pts\n N:${p.normal} A:${p.atrevido} E:${p.extremo}\n\n`
      })
      return sock.sendMessage(chatId, { text: mensaje, mentions: top.map(([u]) => u) }, { quoted: msg })
    }

    // 3. CUMPLIDO - AHORA INICIA VOTACIÓN
    if(texto === 'cumplido') {
      if(!turno[chatId]) return sock.sendMessage(chatId, { text: '《🩸》 No hay reto/verdad activo' }, { quoted: msg })

      const quienCumplio = user
      const quienInicio = turno[chatId].user

      if(quienInicio!== quienCumplio) {
        return sock.sendMessage(chatId, {
          text: `《🩸》 Oe @${quienCumplio.split('@')[0]} no seas sapo 😹\nEl turno es de @${quienInicio.split('@')[0]}`,
          mentions: [quienInicio, quienCumplio]
        }, { quoted: msg })
      }

      clearTimeout(turno[chatId].timer)

      // INICIAMOS VOTACIÓN DE 20 SEGUNDOS
      votacion[chatId] = {votosSi: [], votosNo: []}

      await sock.sendMessage(chatId, {
        text: `《🩸》 @${quienCumplio.split('@')[0]} dice que CUMPLIÓ\n\nGrupo voten en 20s:\n*si* = Si cumplió ✅\n*no* = No cumplió ❌`,
        mentions: [quienCumplio]
      }, { quoted: msg })

      votacion[chatId].timer = setTimeout(() => {
        if(!votacion[chatId]) return
        const {votosSi, votosNo} = votacion[chatId]
        const gano = votosSi.length >= votosNo.length // Empate gana el que cumplió

        if(gano) {
          const {tipo, nivel} = turno[chatId]
          const pts = sumarPunto(quienCumplio, nivel)
          const frase = frasesCumplido[Math.floor(Math.random() * frasesCumplido.length)]
          sock.sendMessage(chatId, {
            text: `《🩸》 *CUMPLIDO NIVEL ${nivel.toUpperCase()}* ⚔️\n\n@${quienCumplio.split('@')[0]} ${frase}\nVotos: ${votosSi.length} ✅ vs ${votosNo.length} ❌\n+${pts} puntos!`,
            mentions: [quienCumplio]
          })
        } else {
          const castigo = penalizaciones[Math.floor(Math.random() * penalizaciones.length)]
          sock.sendMessage(chatId, {
            text: `《🩸》 *NO CUMPLIÓ* 💩\n\n@${quienCumplio.split('@')[0]} el grupo dice que mentiste 😹\nVotos: ${votosSi.length} ✅ vs ${votosNo.length} ❌\n*PENALIZACIÓN:* ${castigo}`,
            mentions: [quienCumplio]
          })
        }
        delete turno[chatId]
        delete votacion[chatId]
      }, 20000)

      delete turno[chatId] // Quitamos el turno para que otro pueda jugar
      return
    }

    // 4. VR
    if(texto === 'vr' || texto.startsWith('vr ')) {
      const args = texto.split(' ')
      const opcion = args[1]
      const nivel = args[2] || 'normal'

      if (!opcion) {
        return sock.sendMessage(chatId, {
          text: `🎮*VR EXTREMO + VOTACIÓN*🎮\n\n@${user.split('@')[0]} elige:\n*vr verdad* 💙 o *vr reto* ❤️\n\n*Niveles:* normal=1pt atrevido=2pt *extremo=3pt*\n*Ej:* vr reto extremo\n*vr ranking* 🏆\nCuando pongas *cumplido* el grupo vota *si* o *no* 😈`,
          mentions: [user]
        }, { quoted: msg })
      }

      if(opcion!== 'verdad' && opcion!== 'reto') {
        return sock.sendMessage(chatId, { text: 'Usa: vr verdad o vr reto' }, { quoted: msg })
      }
      if(!['normal','atrevido','extremo'].includes(nivel)) {
        return sock.sendMessage(chatId, { text: 'Niveles: normal, atrevido, extremo' }, { quoted: msg })
      }

      if(turno[chatId]) return sock.sendMessage(chatId, { text: `《🩸》 Esperen a @${turno[chatId].user.split('@')[0]}`, mentions: [turno[chatId].user] }, { quoted: msg })

      await sock.sendMessage(chatId, { react: { text: '🎲', key: msg.key } })

      const timer = setTimeout(() => {
        if(turno[chatId]) {
          const castigo = penalizaciones[Math.floor(Math.random() * penalizaciones.length)]
          sock.sendMessage(chatId, {
            text: `《🩸》 TIEMPO @${turno[chatId].user.split('@')[0]} 😹\n*PENALIZACIÓN:* ${castigo}`,
            mentions: [turno[chatId].user]
          })
          delete turno[chatId]
        }
      }, 60000)

      turno[chatId] = {user, tipo: opcion, nivel, timer}

      try {
        const prompt = `Genera 1 ${opcion} nivel ${nivel} para grupo WhatsApp. Max 15 palabras. ${nivel==='extremo'?'Muy atrevido y que de risa':nivel==='atrevido'?'Atrevido pero sano':'Divertido y tranqui'}. Solo la pregunta. 1-2 emojis.`
        const res = await fetch(`https://api.delirius.online/ia/gptprompt?text=Genera ${opcion} ${nivel}&prompt=${encodeURIComponent(prompt)}`)
        const json = await res.json()
        if (!json.status) throw new Error('La IA se asustó')

        const pregunta = json.data.slice(0, 120)
        const titulo = opcion === 'verdad'? `💙 *VERDAD ${nivel.toUpperCase()}*` : `❤️ *RETO ${nivel.toUpperCase()}*`
        const puntosTxt = nivel === 'extremo'? '3pts' : nivel === 'atrevido'? '2pts' : '1pt'

        await sock.sendMessage(chatId, {
          text: `${titulo} [${puntosTxt}]\n\n${pregunta}\n\n@${user.split('@')[0]} te toca 🔥\nEscribe *cumplido* en 60s o castigo`,
          mentions: [user]
        }, { quoted: msg })

      } catch (err) {
        clearTimeout(timer)
        delete turno[chatId]
        console.log(err)
        await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } })
      }
      return
    }
  }
}