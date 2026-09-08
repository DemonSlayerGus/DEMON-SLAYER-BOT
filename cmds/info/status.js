import db from "#db"
import os from 'os';

function getDefaultHostId() {
  if (process.env.HOSTNAME) {
    return process.env.HOSTNAME.split('-')[0]
  }
  return 'demon-host'
}

export default {
  command: ['status', 'estate', 'botinfo'],
  category: 'info',
  desc: 'Estado del bot y servidor',
  run: async ({ msg, sock }) => {
    try {
      let users = {}
      let chats = {}
      try { users = await db.getUser() || {} } catch(e){}
      try { chats = await db.getChat() || {} } catch(e){}

      const hostId = getDefaultHostId()
      const registeredGroups = Object.keys(chats).length

      let botSettings = {}
      try { botSettings = await db.getSettings(sock.user.id.split(':')[0] + "@s.whatsapp.net") || {} } catch(e){}

      // FORZADO: Ya no jala de la DB
      const botname = 'DEMON'
      const comandos = botSettings.commandsejecut || '0'
      const userCount = Object.keys(users).length

      const uptime = process.uptime()
      const horas = Math.floor(uptime / 3600)
      const mins = Math.floor((uptime % 3600) / 60)

      const estadoBot =
`╭─「 🩸 *ESTATUS DEMON* 」
│
│ 👹 *Bot:* ${botname}
│ 👤 *Usuarios:* ${userCount.toLocaleString()}
│ 👥 *Grupos:* ${registeredGroups.toLocaleString()}
│ ⚔️ *Cmds Usados:* ${comandos.toLocaleString()}
│ ⏱️ *Activo:* ${horas}h ${mins}m
│
╰───────────────╯`

      const sistema = os.type()
      const cpu = os.cpus().length
      const arquitectura = os.arch()

      const estadoServidor =
`╭─「 ⚡ *SERVIDOR* 」
│
│ 💻 *Sistema:* ${sistema}
│ 🔧 *CPU:* ${cpu} Cores
│ 🏗️ *Arq:* ${arquitectura}
│ 🆔 *Host:* ${hostId}
│
╰───────────────╯`

      const message = `${estadoBot}\n\n${estadoServidor}`
      await msg.reply(message)
      await msg.react("🩸")

    } catch (e) {
      console.log(e)
      await msg.reply(`《✧》 Error: ${e.message}`)
    }
  }
};