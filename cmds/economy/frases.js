const frases = [
  "No eres lo que te pasó. Eres lo que decidiste hacer después de eso. Y eso te hace gigante.",
  "Florece aunque nadie te riegue. Crece aunque nadie te aplauda. Tu proceso es solo tuyo.",
  "La calma es tu superpoder. En un mundo que grita, el que está en paz ya ganó.",
  "Algún día vas a agradecer las puertas que se cerraron. Te estaban empujando a la correcta.",
  "No compitas con nadie. Sé la mejor versión de ti. Esa persona no tiene competencia.",
  "Tu momento va a llegar. Mientras tanto trabaja, cree y no le cuentes a nadie tus planes.",
  "Eres suficiente. No tienes que demostrarle nada a nadie. Solo a ti mismo.",
  "Caerse está permitido. Levantarse es obligatorio. Y tú siempre te levantas.",
  "El universo conspirará a tu favor cuando dejes de conspirar en tu contra con tus pensamientos.",
  "Poco a poco. Día a día. Paso a paso. Así se construyen los sueños.",
  "No apagues tu luz para que otros brillen. Hay espacio para que todos brillen.",
  "Lo que es para ti, te va a encontrar. Aunque te escondas. Aunque tardes. Llega.",
  "Agradece lo que tienes y trabaja por lo que quieres. Esa es la fórmula.",
  "Tu paz vale más que tener razón. Elige tu paz.",
  "Hoy puede ser el día que cambie todo. No lo arruines pensando en ayer.",
  "Eres el resultado de todo lo que superaste. Y eso es motivo de orgullo.",
  "No busques en otros lo que puedes darte tú: amor, respeto y valor.",
  "Suelta lo que no suma. Abraza lo que te hace crecer. Así de simple.",
  "Las cicatrices son pruebas de que sanaste. Y sanar es de valientes.",
  "Confía en el proceso. Nada que valga la pena llega rápido.",
  "Brilla tanto que incomodes a los que viven en la oscuridad.",
  "No estás atrasado. Estás en tu tiempo. Y tu tiempo es perfecto.",
  "La disciplina hoy es libertad mañana. Aguanta un poco más.",
  "Rodéate de gente que te sume, no de gente que te reste. Tu energía es sagrada.",
  "Si duele, es porque estás creciendo. Si asusta, es porque vale la pena.",
  "No esperes que crean en ti. Cree tú primero y los demás te seguirán.",
  "Eres agua. Adáptate, fluye, pero nunca dejes de avanzar.",
  "Un día a la vez. Un problema a la vez. Tú puedes con esto y más.",
  "Lo que das, vuelve. Da amor, da respeto, da tu mejor versión.",
  "No te rindas. Estás más cerca de lo que crees. Solo no pares.",
  "Tu historia no termina aquí. Apenas va por el capítulo donde te haces fuerte.",
  "Elige ser feliz. No porque todo sea perfecto, sino porque decides que lo sea.",
  "Tienes dos opciones: sufrir el proceso o disfrutarlo. Yo elijo disfrutarlo.",
  "No eres un error. Eres una lección. Y las lecciones nos hacen sabios.",
  "Respira. Ya saliste de cosas peores. De esta también sales.",
  "Hazlo por el yo del futuro que te va a dar las gracias.",
  "No todo el mundo va a entender tu camino. Y está bien. No es para ellos.",
  "Cree en ti, aunque tiemble la voz. Háblalo, aunque te dé miedo.",
  "Eres magia. No lo olvides en los días grises.",
  "La vida no se trata de esperar a que pase la tormenta. Se trata de aprender a bailar bajo la lluvia.",
  "Tu valor no disminuye por la incapacidad de otros para verlo.",
  "Empieza donde estás. Usa lo que tienes. Haz lo que puedes.",
  "No te compares. Tú tienes una historia que nadie más puede escribir.",
  "Sigue. Aunque tengas miedo. Aunque dudes. Sigue.",
  "Eres tu hogar. Cuídate, quiérete y habítate bonito.",
  "Lo mejor está por venir. Y cuando llegue, vas a decir: valió la pena esperar.",
  "No pidas permiso para existir. Ocupa tu espacio. Te lo ganaste.",
  "Sanar también es ganar. Y tú estás ganando todos los días.",
  "Hoy elige: o te quejas o haces algo al respecto. Las dos no se puede.",
  "Eres capaz de cosas increíbles. Solo deja de sabotearte.",
  "La vida te pone pruebas para ver de qué estás hecho. Demuéstrale.",
  "No busques ser perfecto. Busca ser real. Eso conecta.",
  "Tu único límite es el que te pones en la mente. Rompe eso y eres libre.",
  "Agradece. Incluso por lo malo. Todo te está enseñando algo.",
  "No corras. Camina. Pero nunca retrocedas.",
  "Eres luz. Y la luz siempre encuentra la forma de salir.",
  "Cree. Trabaja. Agradece. Repite.",
  "Lo que siembras hoy, lo cosechas mañana. Siembra bonito.",
  "Al final todo va a estar bien. Y si no está bien, es porque todavía no es el final."
]

export default {
  command: ['frases', 'frase'],
  category: 'fun',
  run: async ({ msg }) => {
    const random = frases[Math.floor(Math.random() * frases.length)]
    
    const txt = `「✦」 *FRASE DEL DÍA*\n\n> “${random}”\n\n_Guárdala en tu corazón ✨_`
    
    await msg.reply(txt)
    await msg.react('🌹')
  }
}