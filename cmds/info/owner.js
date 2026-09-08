import db from "#db"

export default {
  command: ['owner', 'creator', 'dueño', 'propietario'],
  category: 'info',
  desc: 'Contacto del owner',
  run: async ({ msg, sock }) => {
    
    const ownerNumber = '51980730680' // TU NUMERO
    const ownerName = 'LORD GUS' // TU NOMBRE
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:DEMON BOT;Cuenta de empresa
TEL;type=CELL;type=WHATSAPP;waid=${ownerNumber}:${ownerNumber}
END:VCARD`

    await sock.sendMessage(msg.chat, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    })
    
    await sock.sendMessage(msg.chat, { 
      text: `*👹 OWNER DE DEMON BOT*\n\n*Nombre:* ${ownerName}\n*Numero:* +${ownerNumber}\n\nToca el contacto de arriba para hablarme 👆` 
    }, { quoted: msg })
    
    await msg.react("🩸")
  }
};