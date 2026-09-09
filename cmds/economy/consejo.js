const consejos = [
  "Bro, no persigas a quien no te valora. El que te quiere de verdad hace espacio en su vida, no te pone excusas. Tu paz mental vale más que 1000 personas.",
  "Deja de compararte con los demás en redes. Ahí todos suben su mejor momento. Tú no sabes las 3am llorando que hubo detrás de esa foto. Enfócate en tu proceso.",
  "Si algo te quita el sueño 3 noches seguidas, tómalo en serio. Tu intuición no grita, susurra. Escúchala antes de que te toque gritar a ti por no hacerle caso.",
  "El dinero va y viene, pero el tiempo no. Deja de gastar horas en gente que no invertiría 5 minutos en ti. Rodeate de los que suman, no de los que restan.",
  "Perdonar no es por ellos, es por ti. Cargar rencor es como tomar veneno esperando que el otro se enferme. Suéltalo y sigue ligero.",
  "No le cuentes tus planes a todo el mundo. El agua no hace ruido cuando llena el vaso. Trabaja en silencio y deja que el éxito meta bulla por ti.",
  "Si tienes que rogar atención, amor o respeto... ahí no es. Lo bueno no se ruega, se da solo. Aprende a irte a tiempo.",
  "Cuida tu cuerpo como si fueras a vivir 100 años y tu alma como si fueras a morir mañana. Gym, agua, comida y también oración, libros y música.",
  "Los amigos de verdad aparecen cuando estás quebrado, no cuando tienes plata. Valora a los 2 o 3 que se quedan cuando no tienes nada que ofrecer.",
  "Deja de esperar el 'momento perfecto' para empezar. Ese momento es hoy, con miedo y todo. La acción cura la ansiedad.",
  "No discutas con gente que no busca entender, solo busca tener razón. Gastas energía y no ganas nada. Mejor guárdala para ti.",
  "Si fallas, falla intentando algo grande. Es mejor arrepentirte de lo que hiciste que de lo que nunca te atreviste a hacer.",
  "Tu ex no es tu psicólogo, tu amigo no es tu terapeuta, y tu mamá no es Google. Busca ayuda profesional si la necesitas. No hay nada de malo en eso.",
  "Deja de contestar en caliente. Duerme, respira, y responde al día siguiente. El 90% de problemas se arreglan solos si no los empeoras con rabia.",
  "Invierte en ti antes que en marcas. Un curso, un libro, gym, terapia. Eso nadie te lo quita. La ropa pasa de moda, el conocimiento no.",
  "Si alguien te muestra quien es 2 veces, créelo la primera. La gente no cambia de la noche a la mañana. Deja de darle segundas oportunidades al mismo error.",
  "No todos merecen tu versión explicada. A veces 'no' es una respuesta completa. No debes justificar tu paz.",
  "La disciplina le gana al talento cuando el talento no es disciplinado. 1 hora diaria > 10 horas un solo día.",
  "Deja el teléfono 1 hora al día y sal a caminar sin música. Piensa. Conéctate contigo. El ruido externo te está aturdiendo por dentro.",
  "No vivas para complacer. Vas a decepcionar a algunas personas de todas formas. Asegúrate que no seas tú.",
  "Si te duele, háblalo. Guardarte todo te enferma. Busca a alguien de confianza o escríbelo. Sacarlo es el primer paso para sanar.",
  "El rechazo te está redirigiendo, no te está rechazando. Esa puerta que se cerró te está empujando a una mejor.",
  "Deja de ver porno y empieza a ver metas. Dopamina barata te destruye la motivación. Cambia el vicio por disciplina y vas a ver resultados.",
  "Ahorra aunque sea 10 soles. El hábito es más importante que la cantidad. El yo del futuro te lo va a agradecer un montón.",
  "No le tengas miedo a empezar de cero. Esta vez no empiezas desde cero, empiezas desde la experiencia.",
  "Si una amistad solo funciona cuando tú inicias, entonces no es amistad. Es tu trabajo. Y ya te despidieron.",
  "Tu salud mental > tu nota > tu trabajo > todo. Sin ti bien, nada de lo demás funciona. Priorízate sin culpa.",
  "Deja de stalkeas a tu ex. Cada vez que lo haces te clavas el cuchillo tú mismo. Bloquea y sana. Por ti.",
  "Aprende a estar solo. Si no disfrutas tu propia compañía, vas a aceptar cualquier compañía por miedo a la soledad.",
  "El respeto se gana con límites, no rogando. Ponlos claros desde el inicio y la gente sabrá como tratarte.",
  "No tomes decisiones permanentes con emociones temporales. El enojo, la tristeza y la euforia pasan. Espera 24h antes de decidir.",
  "Si quieres algo, pídelo. La gente no lee mentes. Comunicar evita el 80% de problemas en relaciones y trabajo.",
  "Deja de querer arreglar a la gente. Cada quien carga su propia cruz. Ayuda si puedes, pero no te sacrifiques.",
  "Lee. 10 páginas al día son 12 libros al año. En 5 años eres otra persona. El conocimiento compuesto es real.",
  "No envidies. Admira y aprende. El que envidia se estanca, el que admira crece. Usa a los de arriba como mapa, no como competencia.",
  "Si algo es gratis, tú eres el producto. Cuida tus datos, tu tiempo y tu atención. Son lo más caro que tienes.",
  "La constancia aburre, pero da resultados. Haz lo aburrido bien hecho todos los días y vas a destacar solo.",
  "No le debes explicaciones a quien no estuvo en el proceso. Que hablen. Tú sigue facturando en silencio.",
  "Dile 'te quiero' a tu gente hoy. Mañana puede ser tarde. Un mensaje, una llamada. No cuestan nada y valen todo.",
  "Si te sientes estancado, cambia de ambiente. Ve al gym, sal a correr, viaja, conoce gente nueva. El cuerpo quieto, mente quieta.",
  "No le tengas miedo al 'qué dirán'. En 5 años esa gente ni se va a acordar. Pero tú vas a vivir con tus decisiones todos los días.",
  "Aprende a decir que no sin dar explicaciones. Tu tiempo es limitado. Cada 'sí' a otros es un 'no' a ti.",
  "El overthinking te roba el presente. El pasado ya fue, el futuro no ha llegado. Vive hoy. Respira hoy.",
  "Rodeate de gente que hable de ideas, proyectos y crecimiento. Si solo hablan de otros, tú eres el siguiente tema.",
  "Celebra tus pequeñas victorias. Bajaste 1kg, ahorraste 50, terminaste un libro. Reconócete. La motivación viene de ahí.",
  "No compitas con nadie. Tu única competencia es el de ayer. Sé 1% mejor cada día y en un año eres irreconocible.",
  "Si te mienten una vez, es error. Si te mienten dos veces, es decisión. Y tú decides si sigues ahí.",
  "Cuida tu energía. No todos merecen acceso a ti. Bloquea, silencia, aléjate. La paz se protege.",
  "El dinero no da felicidad, pero la pobreza sí da problemas. Busca estabilidad. Trabaja duro ahora para vivir tranquilo después.",
  "Aprende a cocinar 3 platos, a lavar tu ropa y a pagar tus cuentas. Ser adulto es eso. Independencia da paz.",
  "No idealices a nadie. Todos la cagamos. Pon a la gente en un pedestal y te va a doler cuando se caigan.",
  "Si tienes un sueño, escríbelo. Si lo escribes, lo planeas. Si lo planeas, lo ejecutas. Si lo ejecutas, lo cumples.",
  "Deja de buscar validación en likes. Valídate tú. Pregúntate: ¿yo estoy orgulloso de mí? Eso es todo.",
  "El gym no es solo físico. Es mental. Aprendes disciplina, constancia y a no rendirte cuando duele. Aplícalo a la vida.",
  "No tengas miedo de pedir perdón y tampoco miedo de alejarte. Las dos cosas requieren huevos.",
  "Tu círculo íntimo debería tener máximo 5 personas. Calidad > cantidad. 100 conocidos no valen 1 hermano.",
  "Si algo te da ansiedad, enfréntalo. Evitarlo solo lo hace más grande en tu cabeza. Acción mata miedo.",
  "Recuerda de donde vienes. Eso te mantiene humilde. Recuerda a donde vas. Eso te mantiene hambriento.",
  "Por último bro: Nadie va a venir a salvarte. Levántate tú. Tú eres el protagonista de tu historia. Dale con todo."
]

export default {
  command: ['consejo', 'tip'],
  category: 'fun',
  run: async ({ msg }) => {
    const random = consejos[Math.floor(Math.random() * consejos.length)]
    
    const txt = `「✦」 *CONSEJO DEL DÍA*\n\n> ${random}\n\n_Tómalo, aplícalo y sigue pa' delante 👹_`
    
    await msg.reply(txt)
    await msg.react('💡')
  }
}