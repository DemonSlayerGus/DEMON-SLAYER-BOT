import db from "#db"

export default {
  command: ['mercado', 'trabajar', 'work'],
  category: 'economia',
  run: async ({ msg, args }) => {
    const user = await db.getChatUser(msg.chat, msg.sender)
    const chatData = await db.getChat(msg.chat)

    if (chatData.adminonly ||!chatData.rpg) return msg.reply('「❌」 *RPG está apagado en este chat*')

    user.lastWork = user.lastWork || 0

    const trabajos = {
      cajero: { min: 800, max: 1800, cooldown: 5 * 60 * 1000, emoji: '🏪' },
      papeleria: { min: 1200, max: 2500, cooldown: 8 * 60 * 1000, emoji: '📚' },
      panaderia: { min: 1500, max: 3000, cooldown: 10 * 60 * 1000, emoji: '🥖' },
      tienda: { min: 2000, max: 4000, cooldown: 12 * 60 * 1000, emoji: '🛒' },
      plomero: { min: 3500, max: 6000, cooldown: 15 * 60 * 1000, emoji: '🔧' },
      carpintero: { min: 4000, max: 7000, cooldown: 18 * 60 * 1000, emoji: '🪚' },
      electricista: { min: 5000, max: 9000, cooldown: 20 * 60 * 1000, emoji: '⚡' },
      albañil: { min: 6000, max: 11000, cooldown: 25 * 60 * 1000, emoji: '🧱' },
      maestro: { min: 4000, max: 7000, cooldown: 20 * 60 * 1000, emoji: '📖' },
      ingeniero: { min: 8000, max: 13000, cooldown: 30 * 60 * 1000, emoji: '👷' },
      licenciado: { min: 10000, max: 16000, cooldown: 40 * 60 * 1000, emoji: '⚖️' },
      doctor: { min: 15000, max: 25000, cooldown: 50 * 60 * 1000, emoji: '👨‍⚕️' },
      investigador: { min: 20000, max: 35000, cooldown: 60 * 60 * 1000, emoji: '🔬' }
    }

    const frases = {
      cajero: ['Cobraste en caja todo el día', 'Atendiste a 50 clientes'],
      papeleria: ['Vendiste útiles escolares', 'Sacaste 100 copias'],
      panaderia: ['Horneaste pan calientito', 'Vendiste pasteles de cumple'],
      tienda: ['Repusiste todos los estantes', 'Vendiste de todo un poco'],
      plomero: ['Arreglaste 3 tuberías rotas', 'Destapaste un baño'],
      carpintero: ['Hiciste una mesa de madera', 'Arreglaste una puerta'],
      electricista: ['Instalaste el cableado', 'Arreglaste un corto circuito'],
      albañil: ['Levantaste una pared', 'Colaste cemento todo el día'],
      maestro: ['Diste clases a 30 alumnos', 'Calificaste exámenes'],
      ingeniero: ['Diseñaste un puente', 'Supervisaste la obra'],
      licenciado: ['Ganaste un caso difícil', 'Firmaste contratos millonarios'],
      doctor: ['Salvaste a un paciente', 'Diste 20 consultas'],
      investigador: ['Descubriste algo nuevo', 'Publicaste en una revista científica']
    }

    // ESTA FUNCION QUITA ACENTOS: panadería -> panaderia
    function quitarAcentos(texto) {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    }

    let trabajo = quitarAcentos(args[0] || '') // <-- AQUI ESTA EL CAMBIO

    if (!trabajo ||!trabajos[trabajo]) {
      let texto = `「💼」 *BOLSA DE TRABAJO NAGI* 💼\n`
      texto += `「📢」 *Trabaja y gana dinero en diferentes oficios*\n\n`
      for (let t in trabajos) {
        let j = trabajos[t]
        texto += `${j.emoji} *.mercado ${t}*\n`
        texto += ` 💰 Ganas: ¥${j.min.toLocaleString()} - ¥${j.max.toLocaleString()}\n`
        texto += ` ⏰ Cooldown: ${j.cooldown/60000} minutos\n`
      }
      texto += `「💡」 *Tip*: Entre más difícil el trabajo, más paga`
      return msg.reply(texto)
    }

    let job = trabajos[trabajo]
    let tiempo = job.cooldown - (Date.now() - user.lastWork)
    if (tiempo > 0) return msg.reply(`「⏰」 *Espera ${msToTime(tiempo)}* para volver a trabajar como ${trabajo}`)

    let ganancia = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min
    let frase = frases[trabajo][Math.floor(Math.random() * frases[trabajo].length)]

    await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins + ganancia)
    await db.updateChatUser(msg.chat, msg.sender, 'lastWork', Date.now())

    let reply = `「${job.emoji}」 *TRABAJASTE DE: ${trabajo.toUpperCase()}*\n\n`
    reply += `「📄」 ${frase}\n\n`
    reply += `「💰」 *Ganancia*: ¥${ganancia.toLocaleString()}\n`
    reply += `「💳」 *Total en cartera*: ¥${(user.coins + ganancia).toLocaleString()}`

    msg.reply(reply)
    msg.react('💵')
  }
}

function msToTime(ms) {
  let min = Math.floor(ms / 60000)
  let seg = ((ms % 60000) / 1000).toFixed(0)
  return `${min}m ${seg}s`
}