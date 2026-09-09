import db from "#db"

export default {
  command: ['poema', 'dedicar'],
  category: 'economy',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    const mention = msg.mentionedJid?.[0] || msg.quoted?.sender || null
    const poema = pickRandom(poemas)

    if(mention){
      const targetName = '@' + mention.split('@')[0]
      const senderName = '@' + msg.sender.split('@')[0]
      const texto = `「🥀」 *POEMA DEDICADO*\n\n${poema}\n\n_Para: ${targetName}_\n_De: ${senderName}_`

      await sock.sendMessage(msg.chat, {
        text: texto,
        mentions: [mention, msg.sender]
      }, { quoted: msg })
    } else {
      const texto = `「🥀」 *POEMA PARA TI*\n\n${poema}\n\n_Con cariño para @${msg.sender.split('@')[0]}_`

      await sock.sendMessage(msg.chat, {
        text: texto,
        mentions: [msg.sender]
      }, { quoted: msg })
    }
  },
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const poemas = [
  `Eres como el amanecer en Iquitos,\ncalorcito que alegra hasta el alma.\nTu sonrisa ilumina mis días grises.`,
  `Si mis palabras fueran flores,\nte regalaría un jardín completo.\nPorque te mereces todo lo bonito.`,
  `Tu nombre se volvió mi canción favorita.\nLa repito bajito cada vez que te extraño.`,
  `No sabía que existían personas luz,\nhasta que llegaste tú y pintaste mi mundo.`,
  `Eres mi lugar seguro.\nDonde puedo ser yo sin miedo.`,
  `Contigo hasta el silencio se siente bonito.\nPorque tu presencia lo dice todo.`,
  `Si el destino me diera a elegir otra vez,\nvolvería a encontrarte mil veces.`,
  `Tienes esa magia de hacer\nque lo simple se sienta especial.`,
  `Eres poesía caminando.\nY yo solo quiero leerte todos los días.`,
  `Me gustas en tus días buenos,\ny más en los días donde crees que no.`,
  `Tu abrazo debería venir con advertencia:\n"Puede causar adicción y mucha felicidad".`,
  `No prometo ser perfecto,\npero sí prometo quedarme y quererte bien.`,
  `Eres de esas personas que se quedan\nviviendo en el corazón sin pagar renta.`,
  `Si supieras todo lo bonito\nque pienso de ti cuando no estás...`,
  `Contigo aprendí que el amor\nno grita, se queda.`,
  `Eres mi calma en medio del caos,\nmi café en las mañanas frías.`,
  `Gracias por existir.\nEl mundo es mejor con gente como tú.`,
  `No necesito cuentos de hadas,\ncontigo la realidad es más bonita.`,
  `Me encantas.\nEn simple, en complejo, en todo.`,
  `Si te pierdo, pierdo mi parte favorita del día.\nQuédate por favor.`
]