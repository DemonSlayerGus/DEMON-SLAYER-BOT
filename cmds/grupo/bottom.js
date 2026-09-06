import db from "#db"

export default {
  command: ['bottom', 'inactivos', 'fantasmas'],
  category: 'grupo',
  help: ['bottom [días]'], // <- SOLO AGREGA ESTO
  isAdmin: false,
  botAdmin: false,
  run: async ({ msg, sock, args, command, text, usedPrefix }) => {
    const groupInfo = await sock.groupMetadata(msg.chat);
    const participants = groupInfo.participants;
    const botId = sock.decodeJid(sock.user.id);

    const getId = (jid) => jid.split('@')[0];

    let days = parseInt(args[0]) || 7;
    if (days > 90) days = 90;

    await msg.reply(`💀 *Calculando Top Inactivos* 💀\n> Analizando últimos *${days} días*...`);

    const allChatUsers = await db.getChatUser(msg.chat);
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    let ranking = [];
    const participantIds = participants.map(p => p.id);

    for (const user of participantIds) {
      if (user === botId) continue;

      const participant = participants.find(p => p.id === user);
      const userStats = allChatUsers.find(u => u.user_id === user);

      let totalMsgs = 0;
      if (userStats && userStats.stats) {
        const daysData = Object.entries(userStats.stats).filter(([date]) => new Date(date) >= cutoff);
        totalMsgs = daysData.reduce((acc, [, d]) => acc + (d.msgs || 0), 0);
      }

      let name = userStats?.name || getId(user);

      ranking.push({
        id: user,
        name: name,
        msgs: totalMsgs,
        admin: participant.admin? '👑' : ''
      });
    }

    ranking.sort((a, b) => a.msgs - b.msgs);
    const bottom10 = ranking.slice(0, 10);

    if (bottom10.length === 0) return msg.reply('❌ No hay datos de actividad');

    let texto = `💀 *TOP 10 MÁS INACTIVOS* 💀\n> *Últimos ${days} días*\n\n`;

    bottom10.forEach((user, i) => {
      texto += `*${i + 1}.* @${getId(user.id)} ${user.admin} *${user.name}* - *${user.msgs}* mensajes\n`;
    });

    const activos = ranking.filter(u => u.msgs > 0).length;
    texto += `\n🩸 *Activos:* ${activos} usuarios con +1 msgs`;

    return sock.sendMessage(msg.chat, {
      text: texto,
      mentions: bottom10.map(u => u.id)
    }, { quoted: msg });
  },
};