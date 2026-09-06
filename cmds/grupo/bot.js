import db from "#db"
export default {
  command: ['bot'],
  category: 'grupo',
  isAdmin: true,
  run: async ({ msg, sock, args }) => {
    const chat = await db.getChat(msg.chat)
    const estado = chat.bannedGrupo?? 0
    const nombre = "Demon Slayer" // <- SIN HS

    if (args[0] === 'off') {
      if (estado) return msg.reply(`⚔️ *Demon Slayer*\nYa estaba *desactivado* en este grupo.`)

      chat.bannedGrupo = 1
      await db.updateChat(msg.chat, 'bannedGrupo', chat.bannedGrupo)
      return msg.reply(`🩸 *Demon Slayer*\nSe ha *desactivado* en este grupo.`)
    }

    if (args[0] === 'on') {
      if (!estado) return msg.reply(`⚔️ *Demon Slayer*\nYa estaba *activado* en este grupo.`)

      chat.bannedGrupo = 0
      await db.updateChat(msg.chat, 'bannedGrupo', chat.bannedGrupo)
      return msg.reply(`🔥 *Demon Slayer*\nSe ha *activado* en este grupo.`)
    }

    return msg.reply(
      `*⚔️ DEMON SLAYER - ESTADO ⚔️*\n\n` +
      `🤖 *Bot:* ${nombre}\n` +
      `📜 *Estado:* ${estado? '🩸 Desactivado' : '🔥 Activado'}\n\n` +
      `*Usar:*\n` +
      `> ● *bot on* → Activar\n` +
      `> ● *bot off* → Desactivar`
    )
  },
};