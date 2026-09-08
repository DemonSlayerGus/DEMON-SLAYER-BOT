import db from "#db"

const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

async function getGroupName(sock, chatId) {
  try {
    const metadata = await sock.groupMetadata(chatId)
    return metadata?.subject || 'Grupo desconocido'
  } catch {
    return 'Chat privado'
  }
}

export default {
  command: ['invite', 'invitar', 'join'],
  category: 'info',
  run: async ({ msg, sock, args }) => {
    try {
      const grupo = msg.isGroup? await getGroupName(sock, msg.chat) : 'Chat privado'

      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const botSettings = await db.getSettings(botId) || {}

      // Nombre del bot
      const botname = botSettings.namebot2 || botSettings.name || 'Demon Bot'

      const link = args.join(' ')
      if (!link) return msg.reply('《✤》 *Uso:*.invite <link del grupo>')

      const match = link.match(linkRegex)
      if (!match) return msg.reply('《✤》 El enlace ingresado no es válido.')

      // Detectar tipo de bot
      const ownerNumber = '51980730680'
      const isPrincipal = botId.includes(ownerNumber)
      const isPremiumBot = botSettings.botprem === 1
      const isModBot = botSettings.botmod === 1

      const botType = isPrincipal
       ? 'Principal'
        : isPremiumBot
         ? 'Premium'
          : isModBot
           ? 'Mod'
            : 'Sub Bot'

      const sugg = `❀ 𝗦𝗢𝗟𝗜𝗖𝗜𝗧𝗨𝗗 𝗥𝗘𝗖𝗜𝗕𝗜𝗗𝗔

☆ *Usuario ›* ${msg.pushName || 'Anonimo'}
❀ *Enlace ›* ${link}
❀ *Chat ›* ${grupo}

➤ 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧
♡ *Tipo ›* ${botType}
★ *Nombre ›* ${botname}
❐ *Versión ›* @latest`

      // Te llega solo a ti
      const ownerJid = '51980730680@s.whatsapp.net'
      await sock.sendMessage(ownerJid, { text: sugg })

      await msg.reply('《✤》 Enlace enviado con éxito al creador.')
      await msg.react("✅")

    } catch (e) {
      console.log(e)
      await msg.react("❌")
      await msg.reply('《✤》 Ocurrió un error al enviar la solicitud.')
    }
  },
};