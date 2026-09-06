import db from "#db"

export default {
  command: ['owner', 'propietario', 'dueño', 'creator'],
  category: 'info',
  run: async ({ msg, sock }) => {
    const botSettings = await db.getSettings(sock.user.id.split(':')[0] + "@s.whatsapp.net")
    const banner = 'https://d0mwa043ankuvadx.public.blob.vercel-storage.com/nyx/IO4NGjM.png' // NUEVA IMAGEN
    const ownerName = 'LORD GUS'
    const ownerNumber = '51980730680'
    const link = botSettings.link || ''

    const message = `> ꕤ ˖ ౼ *CONTACTO DEL OWNER*

ׅ ׄ ⚔️ ׅ り Nombre :: *${ownerName}*
ׅ ׄ ⚔️ ׅ り Tipo :: *Owner Principal*
ׅ ׄ ⚔️ ׅ り Bot :: *SHINOBI BOT*

𖹭᳔ㅤ❏ㅤׅㅤゕㅤ𑄾

> *¿Necesitas algo?*
> Háblale directo al Owner 👇

> \`WhatsApp:\` wa.me/${ownerNumber}
> \`Grupo:\` ${link}

*Desarrollado con honor por LORD GUS* 🖤`.trim()

    await sock.sendMessage(
      msg.chat,
      {
        image: { url: banner },
        caption: message,
        contextInfo: {
          mentionedJid: [`${ownerNumber}@s.whatsapp.net`],
          isForwarded: false
        }
      },
      { quoted: msg }
    )
  }
};