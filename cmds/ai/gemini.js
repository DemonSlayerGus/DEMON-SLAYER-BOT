import fetch from 'node-fetch'

export default {
  command: ['gemini', 'ia', 'ai'],
  category: 'ia',
  run: async ({ msg, sock, args }) => {
    const query = args.join(' ')
    
    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *DEMON IA* ⚔️\n\n𖣣ֶㅤ֯⌗ *Uso:* .gemini <tu pregunta>`
      }, { quoted: msg })
    }

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🧠', key: msg.key } })

    try {
      const res = await fetch(`https://api.delirius.online/ia/gemini?query=${encodeURIComponent(query)}`)
      const json = await res.json()

      if (!json.status) throw new Error('La IA no respondió')

      const respuesta = json.data.result // <- aquí estaba el error

      await sock.sendMessage(msg.key.remoteJid, {
        text: `《🩸》 *GEMINI IA* ⚔️\n\n${respuesta}`
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