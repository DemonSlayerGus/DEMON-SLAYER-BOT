import cp from 'child_process'
import { promisify } from 'util'
const exec = promisify(cp.exec)

export default {
  command: ['r', 'run', 'shell'],
  isOwner: true,
  run: async ({ msg, sock, args }) => {
    const cmd = args.join(' ').trim()
    if (!cmd) {
      return await sock.sendMessage(msg.chat, { text: '❌ Escribe un comando para ejecutar.\nEjemplo: .r ls' }, { quoted: msg })
    }
    let result
    try {
      result = await exec(cmd)
    } catch (e) {
      result = e
    }
    const { stdout, stderr } = result
    let output = ''
    if (stdout?.trim()) output += `📤 *STDOUT:*\n\`\`${stdout.trim()}\`\`\`\n`
    if (stderr?.trim()) output += `📥 *STDERR:*\n\`\`\`${stderr.trim()}\`\`\``
    if (!output) output = '✅ Comando ejecutado sin salida'

    await sock.sendMessage(msg.chat, { text: output }, { quoted: msg })
  }
}