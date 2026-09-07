import db from "#db"
import fetch from 'node-fetch'

export default {
  command: ['pinterest', 'pin'],
  category: 'search',
  run: async ({ msg, sock, args }) => {
    const chat = msg.chat
    const text = args.join(' ')
    const isPinterestUrl = /^https?:\/\//.test(text)

    if (!text) return msg.reply(`✿ Ingresa un *término* de búsqueda o un enlace de *Pinterest*.`)

    await msg.react('🔍')

    try {
      if (isPinterestUrl) {
        const pinterestUrl = `${api.url}/dl/pinterest?url=${encodeURIComponent(text)}&key=${api.key}`
        const ress = await fetch(pinterestUrl)
        const { data: result } = await ress.json()
        const mediaType = ['image', 'video'].includes(result.type)? result.type : 'image'
        await sock.sendMessage(chat, { [mediaType]: { url: result.dl }, caption: '*Pinterest Downloader* 🩸' }, { quoted: msg })
      } else {
        const pinterestAPI = `${api.url}/search/pinterest?query=${encodeURIComponent(text)}&key=${api.key}`
        const res = await fetch(pinterestAPI)
        const jsons = await res.json()
        const results = jsons.data

        if (!results || results.length === 0) return msg.reply(`✿ No se encontraron resultados para *${text}*`)

        const medias = results.slice(0, 10)

        // Banner antes del album
        await sock.sendMessage(chat, {
          text: `ꕥ ꨩᰰ𑪐𑂺 ˳ ׄ 𝖣𝖤𝖬𝖮N 𝖡𝖮𝖳 ࣭𑁯ᰍ ̊ ܃\n\n𖣣ֶㅤ֯⌗ 🔍 ⬭ *${text}*\n𖣣ֶㅤ֯⌗ 📥 ⬭ Enviando *10 imágenes* en álbum`
        }, { quoted: msg })

        // CREAR ALBUM
        const album = []
        for (let i = 0; i < medias.length; i++) {
          album.push({
            image: { url: medias[i].hd || medias[i].url },
            caption: i === 0? `*Pinterest:* ${text} 🩸\n\nResultados: 1-${medias.length}` : undefined
          })
        }

        await sock.sendMessage(chat, {
          album: album
        }, { quoted: msg })

        await msg.react('✅')
      }
    } catch (e) {
      console.log(e)
      await msg.react('❌')
      await msg.reply(`《🩸》 Error: ${e.message}`)
    }
  },
}