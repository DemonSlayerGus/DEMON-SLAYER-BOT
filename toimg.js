import { exec } from 'child_process'
import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'

export default {
  command: ['toimg', 'toimage'],
  category: 'utils',
  run: async ({ msg, sock }) => {
    if (!msg.quoted) return sock.reply(msg.chat, `✿ Debes citar un sticker para convertir a imagen.`, msg)
    
    if (!msg.quoted.mimetype.includes('webp')) {
      return sock.reply(msg.chat, `✿ Eso no es un sticker bro`, msg)
    }

    await msg.react('🕒')
    
    try {
      let buffer = await msg.quoted.download()
      if (!buffer) {
        await msg.react('✖️')
        return sock.reply(msg.chat, `✿ No se pudo descargar el sticker.`, msg)
      }

      // Convertir webp a png
      let inFile = join('./temp', Date.now() + '.webp')
      let outFile = inFile.replace('.webp', '.png')
      await writeFile(inFile, buffer)

      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${inFile} ${outFile}`, async (err) => {
          if (err) return reject(err)
          resolve()
        })
      })

      let pngBuffer = await readFile(outFile)
      await unlink(inFile)
      await unlink(outFile)

      await sock.sendMessage(msg.chat, { image: pngBuffer, caption: '✿ Listo bro' }, { quoted: msg })
      await msg.react('✔️')
      
    } catch (e) {
      console.log(e)
      await msg.react('✖️')
      sock.reply(msg.chat, `✿ Error al convertir el sticker`, msg)
    }
  }
}