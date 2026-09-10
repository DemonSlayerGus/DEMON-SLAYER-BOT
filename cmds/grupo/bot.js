import db from "#db"
export default {
  command: ['bot'],
  category: 'grupo',
  isAdmin: true,
  run: async ({ msg, sock, args }) => {
    const chat = await db.getChat(msg.chat) || {}
    const estado = Number(chat.bannedGrupo) || 0 // <- para que no falle si es string
    const botId = sock.user.id.split(':')[0] + "@s.whatsapp.net"
    const bot = await db.getSettings(botId)

    const arg = args[0]?.toLowerCase() // <- para que acepte MAYUSCULAS

    if (arg === 'off') {
      if (estado === 1) return msg.reply('✿ El *Bot* ya estaba *desactivado* en este grupo.')
      await db.updateChat(msg.chat, 'bannedGrupo', 1) // <- como lo tenías antes
      return msg.reply(`✿ Has *Desactivado* a *${bot.namebot2}* en este grupo.`)
    }

    if (arg === 'on') {
      if (estado === 0) return msg.reply(`《✧》 *${bot.namebot2}* ya estaba *activado* en este grupo.`)
      await db.updateChat(msg.chat, 'bannedGrupo', 0) // <- como lo tenías antes
      return msg.reply(`✿ Has *Activado* a *${bot.namebot2}* en este grupo.`)
    }

    return msg.reply(
      `*✿ Estado de ${bot.namebot2} (｡•́‿•̀｡)*\n✐ *Actual ›* ${estado? '✗ Desactivado' : '✓ Activado'}\n\n✎ Puedes cambiarlo con:\n> ● _Activar ›_ *bot on*\n> ● _Desactivar ›_ *bot off*`,
    )
  },
};