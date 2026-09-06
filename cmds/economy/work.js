import db from "#db"
export default {
  command: ['w', 'work'],
  category: 'rpg',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    const chat = await db.getChat(msg.chat)
    const user = await db.getChatUser(msg.chat, msg.sender)
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = await db.getSettings(botId)
    const monedas = botSettings.currency;

    if (chat.adminonly ||!chat.rpg)
      return sock.sendMessage(msg.chat, { text: mess.comandooff }, { quoted: msg })

    if (!user.workCooldown) user.workCooldown = 0;
    const remainingTime = user.workCooldown - Date.now();

    if (remainingTime > 0) {
      return sock.sendMessage(msg.chat, { text: `✿ Debes esperar *${msToTime(remainingTime)}* para trabajar de nuevo.` }, { quoted: msg })
    }

    const rsl = Math.floor(Math.random() * 5000);
    user.workCooldown = Date.now() + 10 * 60 * 1000; // 10 minutos
    user.coins += rsl;

   await db.updateChatUser(msg.chat, msg.sender, 'coins', user.coins)
   await db.updateChatUser(msg.chat, msg.sender, 'workCooldown', user.workCooldown)

        await sock.sendMessage(msg.chat, { text: `「✿」 ${pickRandom(trabajo)} *¥${rsl.toLocaleString()} ${monedas}*.` }, { quoted: msg })
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const min = minutes < 10? '0' + minutes : minutes;
  const sec = seconds < 10? '0' + seconds : seconds;

  return min === '00'
   ? `${sec} segundo${sec > 1? 's' : ''}`
    : `${min} minuto${min > 1? 's' : ''}, ${sec} segundo${sec > 1? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const trabajo = [
  "Trabajas como recolector de fresas y ganas",
  "Eres asistente en un taller de cerámica y obtienes",
  "Diseñas páginas web y ganas",
  //... tu lista completa
  "Hiciste un workshop de manualidades y recibiste"
];