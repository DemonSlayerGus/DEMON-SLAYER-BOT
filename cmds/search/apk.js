import db from "#db"
import axios from 'axios';

export default {
  command: ['aptoide', 'apk', 'apkdl'],
  category: 'search',
  run: async ({ msg, sock, args }) => {
    if (!args || !args.length) {
      return sock.sendMessage(msg.chat, { text: '✨ *APK DOWNLOADER*\n\nIngresa el nombre de la app.\n_Ej:_ `.apk instagram`' }, { quoted: msg })
    }

    const query = args.join(' ').trim()
    const chatId = msg.chat

    try {
      await sock.sendMessage(chatId, { react: { text: '🔍', key: msg.key }})
      
      const { data: res } = await axios.get(
        `${api.url}/search/apk?query=${encodeURIComponent(query)}&key=${api.key}`,
      )
      
      const data = res?.data || res

      if (!data || !data.name || !data.dl) {
        await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key }})
        return sock.sendMessage(chatId, { text: `❌ No se encontró: *${query}*` }, { quoted: msg })
      }

      const caption = `
*📲 APK ENCONTRADA*

*▢ Nombre:* ${data.name}
*▢ Paquete:* \`${data.package || 'N/A'}\`
*▢ Versión:* ${data.version || 'N/A'}
*▢ Tamaño:* ${data.size || 'N/A'}
*▢ Actualizado:* ${data.lastUpdated || 'N/A'}
*▢ Desarrollador:* ${data.developer || 'N/A'}

_⬇️ Enviando archivo..._`

      // Intentar mandar con imagen
      if (data.icon || data.image || data.thumbnail) {
        await sock.sendMessage(
          chatId,
          {
            image: { url: data.icon || data.image || data.thumbnail },
            caption: caption,
          },
          { quoted: msg },
        )
      } else {
        // Si no hay imagen, manda solo texto
        await sock.sendMessage(chatId, { text: caption }, { quoted: msg })
      }

      // Mandar APK
      await sock.sendMessage(
        chatId,
        {
          document: { url: data.dl },
          fileName: `${data.name}.apk`,
          mimetype: 'application/vnd.android.package-archive',
          caption: `*${data.name}*\n> ${global.dev || 'Bot by Nagi'}`,
        },
        { quoted: msg },
      )
      
      await sock.sendMessage(chatId, { react: { text: '✅', key: msg.key }})

    } catch (error) {
      console.error(error)
      await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key }})
      await sock.sendMessage(chatId, { text: `❌ Error: ${error.message}` }, { quoted: msg })
    }
  },
};