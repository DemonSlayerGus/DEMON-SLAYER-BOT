import { exec } from 'child_process'
export default {
  command: ['exec', 'x'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return msg.reply(`❌ *Uso:*.exec ls`)
    exec(text, (e, stdout) => {
      msg.reply(stdout || e)
    })
  }
}