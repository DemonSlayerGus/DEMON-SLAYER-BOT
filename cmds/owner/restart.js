import db from "#db"
export default {
  command: ['restart'],
  category: 'mod',
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.sendMessage(msg.chat, { 
      text: `✎ Reiniciando el Socket...\n> *Espere un momento...*` 
    }, { quoted: msg })
    
    setTimeout(() => {
      process.exit(0)
    }, 3000)
  },
};