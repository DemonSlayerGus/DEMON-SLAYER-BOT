export default {
  command: ['eval', 'e', 'ejecutar'],
  category: 'owner',
  owner: true,
  run: async ({ msg, sock, text }) => {
    if (!text) return sock.sendMessage(msg.chat, { text: `❌ *Uso:*.e codigo\n*Ej:* .e 1+1` }, { quoted: msg })
    try {
      let res = await eval(text)
      sock.sendMessage(msg.chat, { text: `「✦」*Resultado:*\n\`\`${res}\`\`` }, { quoted: msg })
    } catch(e) {
      sock.sendMessage(msg.chat, { text: `❌ *Error:* ${e}` }, { quoted: msg })
    }
  }
}