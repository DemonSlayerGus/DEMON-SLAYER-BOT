import db from "#db"
import moment from 'moment-timezone';

export default {
  command: ['profile', 'perfil'],
  category: 'profile',
  desc: 'Muestra el perfil de un usuario',
  run: async ({ msg, sock }) => {
    try {
      const mentioned = msg.mentionedJid || []
      const userId = mentioned[0] || (msg.quoted? msg.quoted.sender : msg.sender)

      const globalUser = await db.getUser(userId)
      const chatUser = await db.getChatUser(msg.chat, userId)

      if (!globalUser) {
        return msg.reply('✐ El usuario *mencionado* no está *registrado* en el bot\nUsa *.register* para registrarte')
      }

      const idBot = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const settings = await db.getSettings(idBot) || {}
      const currency = settings.currency || '¥'

      // Datos del usuario
      const name = globalUser.name || userId.split('@')[0]
      const birth = globalUser.birth || 'Sin especificar'
      const genero = globalUser.genre || 'Oculto'
      const desc = globalUser.description || ''
      const pasatiempo = globalUser.pasatiempo || 'No definido'
      const exp = globalUser.exp || 0
      const nivel = globalUser.level || 0
      const comandos = typeof globalUser.usedcommands === 'object'
      ? Object.values(globalUser.usedcommands).reduce((a,b) => a + b, 0)
        : globalUser.usedcommands || 0

      const monedas = chatUser?.coins || 0
      const banco = chatUser?.bank || 0
      const totalCoins = monedas + banco
      const harem = chatUser?.characters?.length || 0

      // Pareja
      let pareja = 'Nadie'
      if (globalUser.marry) {
        const spouseData = await db.getUser(globalUser.marry)
        pareja = spouseData?.name || globalUser.marry.split('@')[0]
      }

      const estadoCivil = genero === 'Mujer'? 'Casada con' : genero === 'Hombre'? 'Casado con' : 'Casadx con'

      // RANKING ARREGLADO - saca todos los users del chat
      let rank = '-'
      try {
        const chatData = await db.getChat(msg.chat)
        const allChatUsers = chatData?.users || []

        const usersWithLevel = []
        for (let u of allChatUsers) {
          const uData = await db.getUser(u)
          if (uData) usersWithLevel.push({ id: u, level: uData.level || 0 })
        }

        usersWithLevel.sort((a, b) => b.level - a.level)
        const rankIndex = usersWithLevel.findIndex(u => u.id === userId)
        rank = rankIndex >= 0? `#${rankIndex + 1}` : '-'
      } catch(e) {
        rank = '-'
      }

      // Foto de perfil
      const perfil = await sock.profilePictureUrl(userId, 'image')
      .catch(() => 'https://cdn.sockywa.xyz/files/1751246122292.jpg')

      const profileText = `*╭━━━〔 PERFIL 〕━━━╮*
*│* 𓆩ꕥ𓆪 *${name}*
*│*
*│* 𖣘 *Cumpleaños:* ${birth}
*│* 𖣘 *Pasatiempo:* ${pasatiempo}
*│* 𖣘 *Género:* ${genero}
*│* 𖣘 *${estadoCivil}:* ${pareja}
*│*
*│* 𓆩✧𓆪 *Nivel:* ${nivel}
*│* 𓆩✧𓆪 *EXP:* ${exp.toLocaleString()}
*│* 𓆩✧𓆪 *Ranking:* ${rank}
*│*
*│* 𓆩♡𓆪 *Harem:* ${harem}
*│* 𓆩♡𓆪 *Dinero:* ${totalCoins.toLocaleString()} ${currency}
*│* 𓆩♡𓆪 *Comandos:* ${comandos.toLocaleString()}
*╰━━━━━━━━━━╯*${desc? `\n\n*📜 Descripción:*\n${desc}` : ''}`

      await sock.sendMessage(
        msg.chat,
        {
          image: { url: perfil },
          caption: profileText,
          mentions: [userId, globalUser.marry].filter(Boolean)
        },
        { quoted: msg },
      )

    } catch (e) {
      console.error(e)
      msg.reply(`《🩸》 Error al obtener el perfil: ${e.message}`)
    }
  }
};