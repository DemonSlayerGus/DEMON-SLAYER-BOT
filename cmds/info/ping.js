import db from "#db"

export default {
  command: ['ping', 'p', 'speed'],
  category: 'info',
  desc: 'Muestra la velocidad del bot',
  run: async ({ msg, sock }) => {
    const start = Date.now()

    // Manda mensaje y calcula al toque
    const sent = await msg.reply('《✧》 PING...')

    const latency = Date.now() - start

    const pingText = `*╭─「 🩸 PING 」
│ *Velocidad:* ${latency}ms
│ *Estado:* ${latency < 200? '🔥 Rápido' : latency < 400? '⚡ Normal' : '🐢 Lento'}
╰─「 *DEMON BOT* 」*`

    // Edita el mensaje
    await sock.sendMessage(msg.chat, { 
      text: pingText, 
      edit: sent.key 
    })
  },
};