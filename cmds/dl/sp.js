import db from "#db"
import fetch from 'node-fetch'
import { getBuffer } from "#serialize"
import sharp from "sharp"

export default {
  command: ['sp', 'spotify'],
  category: 'downloader',
  run: async ({ msg, sock, args }) => {
    try {
      if (!args[0]) {
        return sock.sendMessage(msg.chat, { text: '🎵 *SPOTIFY DOWNLOADER*\n\nIngresa el nombre o link de la canción.\n_Ej:_ `.sp blinding lights`' }, { quoted: msg })
      }

      await sock.sendMessage(msg.chat, { react: { text: '🔍', key: msg.key }})

      const query = args.join(' ')
      let url, songInfo

      if (/open\.spotify\.com\/track\//i.test(query)) {
        url = query
        const resInfo = await fetch(`${api.url}/dl/spotify?url=${encodeURIComponent(url)}&key=${api.key}`)
        const resultInfo = await resInfo.json()
        if (!resultInfo.status) return sock.sendMessage(msg.chat, { text: '❌ No se pudo procesar el enlace de Spotify.' }, { quoted: msg })
        songInfo = resultInfo.data
      } else {
        const search = await fetch(`${api.url}/search/spotify?query=${encodeURIComponent(query)}&key=${api.key}`)
        const data = await search.json()
        if (!data.status ||!data.data.length) {
          return sock.sendMessage(msg.chat, { text: '❌ No se encontraron resultados en Spotify' }, { quoted: msg })
        }
        songInfo = data.data[0]
        url = songInfo.url
      }

      const duracion = (!songInfo.duration || songInfo.duration.includes('NaN'))
     ? 'Desconocida'
        : songInfo.duration || ""

      const caption = `*🎵 SPOTIFY - DOWNLOADER*

➤ *Título:* ${songInfo.title || songInfo.name}
➤ *Artista:* ${songInfo.artist || "Desconocido"}
➤ *Álbum:* ${songInfo.album || "Desconocido"}
➤ *Fecha:* ${songInfo.publish || songInfo.year || "N/A"}
➤ *Duración:* ${duracion}
➤ *Link:* ${url}

_⬇️ El archivo se está enviando... Espera un momento_`

      let yi = songInfo.image || songInfo.cover
      await sock.sendMessage(msg.chat, { image: { url: yi }, caption }, { quoted: msg })

      await sock.sendMessage(msg.chat, { react: { text: '⬇️', key: msg.key }})

      const resAudio = await fetch(`${api.url}/dl/spotify?url=${encodeURIComponent(url)}&key=${api.key}`)
      const resultAudio = await resAudio.json()
      if (!resultAudio.status ||!resultAudio.data?.dl) {
        return sock.sendMessage(msg.chat, { text: '❌ No se pudo descargar el audio de Spotify.' }, { quoted: msg })
      }

      const audioRes = await fetch(resultAudio.data.dl)
      if (!audioRes.ok) {
        return sock.sendMessage(msg.chat, { text: '❌ Error al obtener el archivo de audio.' }, { quoted: msg })
      }
      const audioBuffer = Buffer.from(await audioRes.arrayBuffer())

      const bannerBuffer = await getBuffer(resultAudio.data.cover)
      const thumbBuffer2 = await sharp(bannerBuffer)
     .resize(300, 300)
     .jpeg({ quality: 80 })
     .toBuffer()

      const mensaje = {
        document: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: `${resultAudio.data.title || 'music'}.mp3`,
        jpegThumbnail: thumbBuffer2
      }

      await sock.sendMessage(msg.chat, mensaje, { quoted: msg })
      await sock.sendMessage(msg.chat, { react: { text: '✅', key: msg.key }})

    } catch (e) {
      console.error(e)
      await sock.sendMessage(msg.chat, { react: { text: '❌', key: msg.key }})
      await sock.sendMessage(msg.chat, { text: `❌ Error: ${e.message}` }, { quoted: msg })
    }
  }
        }
