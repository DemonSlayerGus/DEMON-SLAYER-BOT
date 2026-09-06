import db from "#db"

export default {
  command: ['ping', 'p', 'speed'],
  category: 'info',
  desc: 'Muestra la velocidad del bot',
  run: async ({ msg, sock }) => {
    const start = Date.now()
    const botName = "DEMON SLAYER BOT"

    // Mensaje cargando
    const sent = await sock.sendMessage(msg.chat, {
      text: `*╭─〔 🩸 DEMON SCAN 〕─╮*\n*│* ⚡ Analizando...\n*╰────────────╯*`
    }, { quoted: msg })

    const latency = Date.now() - start
    const uptime = process.uptime()
    const horas = Math.floor(uptime / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    const segs = Math.floor(uptime % 60)

    const tiempoActivo = `${horas}h ${mins}m ${segs}s`

    // Barra según velocidad
    let bar = '█'.repeat(Math.max(1, 10 - Math.floor(latency/100))) + '░'.repeat(Math.min(9, Math.floor(latency/100)))
    
    let estado = latency < 150? '🔥 EXTREMO' : latency < 300? '⚡ ALTO' : latency < 500? '✨ NORMAL' : '🐢 LENTO'

    const pingText = `*╭───〔 🩸 PING 〕───╮*
*│*
*│* 🤖 *Bot:* ${botName}
*│* ⚡ *Latencia:* ${latency}ms
*│* ${estado}
*│* [${bar}]
*│*
*│* ⏱️ *Uptime:* ${tiempoActivo}
*│*
*╰────────────╯*`

    await sock.sendMessage(msg.chat, {
      text: pingText,
      edit: sent.key
    })
  },
};