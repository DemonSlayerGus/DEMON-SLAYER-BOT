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
      // FIX: Por si db.getUser() da error
      let users = {}
      let chats = {}
      try { users = await db.getUser() || {} } catch(e){}
      try { chats = await db.getChat() || {} } catch(e){}

      const hostId = getDefaultHostId()
      const registeredGroups = Object.keys(chats).length
      const botId = sock.user.id.split(':')[0] + "@s.whatsapp.net"

      let botSettings = {}
      try { botSettings = await db.getSettings(botId) || {} } catch(e){}

      const botname = botSettings.namebot2 || 'DEMON BOT'
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
      const ramTotal = (os.totalmem() / 1024 ** 3).toFixed(2)
      const ramUsada = ((os.totalmem() - os.freem()) / 1024 ** 3).toFixed(2)
      const arquitectura = os.arch()
      const usoRam = ramTotal > 0? ((ramUsada / ramTotal) * 100).toFixed(1) : '0.0'

      const estadoServidor =
`╭─「 ⚡ *SERVIDOR* 」
│
│ 💻 *Sistema:* ${sistema}
│ 🔧 *CPU:* ${cpu} Cores
│ 🧠 *RAM:* ${ramUsada}GB / ${ramTotal}GB [${usoRam}%]
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