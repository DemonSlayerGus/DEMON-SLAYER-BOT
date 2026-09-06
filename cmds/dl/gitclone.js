import db from "#db"
import fetch from 'node-fetch'

export default {
  command: ['gitclone', 'gitclon', 'clone', 'descargarepo'],
  category: 'descargas',
  run: async ({ msg, sock, args }) => {
    const url = args[0]

    if (!url) {
      return msg.reply(`《🩸》 *Uso:*.gitclone https://github.com/usuario/repo\n*Ejemplo:*.gitclone https://github.com/asair3177-cpu/demon-slayer-bot`)
    }

    if (!url.includes('github.com') &&!url.includes('gitlab.com')) {
      return msg.reply('《🩸》 Solo acepto links de *GitHub* o *GitLab* ⚔️')
    }

    await msg.react('⏳')
    await msg.reply('《🩸》 *Demon Slayer Bot*\nDescargando repo... espera un momento Tanjiro 😤')

    try {
        // Sacamos usuario y repo del link
        let match = url.match(/(?:github|gitlab)\.com\/([^/]+)\/([^/]+)/)
        if (!match) return msg.reply('《🩸》 Link inválido')

        let user = match[1]
        let repo = match[2].replace('.git', '')

        // Link directo del zip - probar main primero
        let zipUrl = `https://github.com/${user}/${repo}/archive/refs/heads/main.zip`
        let res = await fetch(zipUrl)

        // Si falla, probar master
        if (!res.ok) {
            zipUrl = `https://github.com/${user}/${repo}/archive/refs/heads/master.zip`
            res = await fetch(zipUrl)
            if (!res.ok) return msg.reply('《🩸》 No se pudo descargar. ¿El repo es privado o no existe?')
        }

        let buffer = await res.buffer()
        let filename = `${repo}.zip`

        await sock.sendMessage(
          msg.chat,
          {
            document: buffer,
            fileName: filename,
            mimetype: 'application/zip',
            caption: `✅ *Repo descargado con éxito*\n\n📦 *Repo:* ${repo}\n👤 *Usuario:* ${user}\n🔗 *Link:* ${url}\n\n*Enviado por:* Demon Slayer Bot ⚔️`
          },
          { quoted: msg }
        )

        await msg.react('✅')

    } catch (e) {
        console.log(e)
        await msg.react('❌')
        await msg.reply(`《🩸》 Error: ${e.message}`)
    }
  },
}