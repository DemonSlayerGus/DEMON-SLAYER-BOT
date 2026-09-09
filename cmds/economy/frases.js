export default {
  command: ['frases'],
  category: 'fun',
  run: async ({ msg, sock }) => {
    const frases = [
      "Si no duele, no sirve.",
      "Ruge o te van a rugir encima.",
      "El débil se queja, el fuerte ejecuta.",
      "No le bajes, súbele 2 rayitas más.",
      "Sangre, sudor y código.",
      "Cállate y hazlo.",
      "El miedo es prestado, la gloria es tuya.",
      "Entrena mientras ellos duermen.",
      "Caer es gratis, levantarse es obligatorio.",
      "Disciplina le gana al talento.",
      "Sin excusas, sin piedad.",
      "Hoy no se rinde nadie.",
      "Tú no naciste para ser del montón.",
      "Quema las naves y avanza.",
      "El dolor de hoy es la fuerza de mañana.",
      "Si quieres algo, ve y tómalo.",
      "Menor charla, mayor acción.",
      "Que te pese el trabajo, no la conciencia.",
      "La zona de confort mata sueños.",
      "Trabaja en silencio y deja que el resultado grite.",
      "Los reyes no piden permiso.",
      "Si te duele es porque estás creciendo.",
      "Constancia mata motivación.",
      "No esperes, provoca.",
      "El respeto se gana a golpes.",
      "Cero quejas, puro resultado.",
      "El que madruga, domina.",
      "Tú pones las reglas.",
      "Forja tu leyenda.",
      "Sin miedo al éxito.",
      "Si no arriesgas, no ganas.",
      "El esfuerzo no negocia.",
      "Levántate y demuestra.",
      "Tú eres el problema y la solución.",
      "Rompe límites o muere intentando.",
      "El tiempo no perdona a los flojos.",
      "Enfócate o estorba.",
      "Grandeza o nada.",
      "La disciplina es libertad.",
      "Si quieres brillar, aguanta la quemada.",
      "El trabajo duro no tiene atajos.",
      "Hoy se construye el mañana.",
      "Que tu nombre pese.",
      "El débil busca excusas, el fuerte busca formas.",
      "Tú decides si ganas o lloras.",
      "La meta no se mueve sola.",
      "Entrégalo todo o no entregues nada.",
      "El éxito es terco como tú.",
      "Deja de ver y empieza a hacer.",
      "Ganar es un hábito.",
      "Caíste 7 veces, levántate 8.",
      "La excusa es el lujo de los perdedores."
    ]

    let frase = frases[Math.floor(Math.random() * frases.length)]
    
    await sock.sendMessage(msg.chat, {
      text: `🔥 *FRASE DEMON SLAYER* 🔥\n\n${frase}`
    }, { quoted: msg })
    
    await msg.react('🔥')
  }
}