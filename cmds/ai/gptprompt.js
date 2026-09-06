import fetch from 'node-fetch'

export default {
  command: ['gpt', 'gptprompt', 'persona'],
  category: 'ia',
  run: async ({ msg, sock, args }) => {
    const text = args.join(' ')
    
    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON GPT* ⚔️\n\n𖣣ֶㅤ֯⌗ *Uso:* .gpt <tu pregunta>`
      }, { quoted: msg })
    }

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🤖', key: msg.key } })

    try {
      // Personalidad propia del bot
      const prompt = `Eres DEMON BOT, un asistente creado por tu dueño. 
      Hablas con estilo serio, directo y un poco edgy. 
      Usas emojis 🩸⚔️ de vez en cuando. 
      Responde siempre en español y no menciones otras IAs.`
      
      const res = await fetch(`https://api.delirius.online/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`)
      const json = await res.json()

      if (!json.status) throw new Error('La IA no respondió')

      const respuesta = json.data

      await sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON GPT* ⚔️\n\n${respuesta}`
      }, { quoted: msg })

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } })

    } catch (err) {
      console.log(err)
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } })
      await sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 Error: ${err.message}`
      }, { quoted: msg })
    }
  },
};