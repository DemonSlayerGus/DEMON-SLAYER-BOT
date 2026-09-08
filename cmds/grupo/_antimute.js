export default {
  before: async (m, { sock }) => {
    if (!m.isGroup) return
    if (!m.sender) return

    const chat = m.chat
    const muteados = global.muteados?.[chat] || []

    // Si el que mandó mensaje está muteado
    if (muteados.includes(m.sender)) {
      try {
        await sock.sendMessage(chat, { delete: m.key })
      } catch (e) {
        console.log('No se pudo borrar el mensaje del muteado')
      }
    }
  }
}