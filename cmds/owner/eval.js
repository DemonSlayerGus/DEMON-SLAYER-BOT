export default {
  command: ['eval', 'ejecutar'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return sock.sendMessage(msg.chat, { text: `❌ *Uso:*.eval codigo` }, { quoted: msg })
    try {
      let res = await eval(text)
      sock.sendMessage(msg.chat, { text: `「✦」*Resultado:*\n${res}` }, { quoted: msg })
    } catch(e) {
      sock.sendMessage(msg.chat, { text: `❌ *Error:* ${e}` }, { quoted: msg })
    }
  }
}