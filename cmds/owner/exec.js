import config from '../../config.js'
import util from 'util'
import os from 'os'

export default {
  command: ['exec', '>', 'run', 'execute'],
  isOwner: true,
  run: async ({ msg, sock, args, command, text }) => {
    
    if (!config.isOwner(msg.sender)) {
      return await sock.sendMessage(msg.chat, { text: '❌ *Owner Only!*' }, { quoted: msg })
    }

    let code = msg.quoted?.text || msg.quoted?.body || msg.quoted?.caption || text

    if (!code) {
      return await sock.sendMessage(msg.chat, { 
        text: `⚙️ *ᴇxᴇᴄ*\n\nReply a un mensaje con código o usa:\n.> <codigo>`
      }, { quoted: msg })
    }

    code = code.trim()
    if (code.startsWith('```')) {
      code = code.replace(/```(js|javascript)?\n?/g, '').replace(/```/g, '')
    }

    let _return
    let isError = false

    try {
      let f = { exports: {} }
      let exec = new (async () => { }).constructor('sock','msg','require','args','os','module','exports',code)
      _return = await exec.call(sock, sock, msg, require, args, os, f, f.exports)
    } catch (e) {
      isError = true
      _return = e
    }

    let output = _return
    if (output === undefined) output = 'undefined'
    if (output === null) output = 'null'
    if (typeof output === 'object') output = util.inspect(output, { depth: 2 })
    if (String(output).length > 3000) output = String(output).slice(0, 3000) + '\n...truncated'

    const status = isError ? '❌ Error' : '✅ Success'

    return await sock.sendMessage(msg.chat, { 
      text: `⚙️ *ᴇxᴇᴄ ʀᴇsᴜʟᴛ* 🩸\n\n` +
            `📋 *Code:* \`${code.slice(0, 50)}${code.length > 50 ? '...' : ''}\`\n` +
            `📊 *Status:* ${status}\n\n` +
            `\`\`\`${output}\`\``
    }, { quoted: msg })
  }
}