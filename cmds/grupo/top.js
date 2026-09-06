import db from "#db"

export default {
  command: ['top', 'activos', 'rank'],
  category: 'grupo',
  help: ['top [días]'], // <- ESTO LE FALTABA
  isAdmin: false,
  botAdmin: false,
  run: async ({ msg, sock, args, command, text, usedPrefix }) => {
    const groupInfo = await sock.groupMetadata(msg.chat);
    const participants = groupInfo.participants;
    const botId = sock.decodeJid(sock.user.id);

    const getId = (jid) => jid.split('@')[0];

    let days = parseInt(args[0]) || 7;
    if (days > 90) days = 90;

    await msg.reply(`🩸 *Calculando Top Activos* 🩸\n> Analizando últimos *${days} días*...`);

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

    ranking.sort((a, b) => b.msgs - a.msgs);
    const top10 = ranking.slice(0, 10);

    if (top10.length === 0) return msg.reply('❌ No hay datos de actividad');

    let texto = `🩸 *TOP 10 MÁS ACTIVOS* 🩸\n> *Últimos ${days} días*\n\n`;

    const medallas = ['🥇', '🥈', '🥉'];
    top10.forEach((user, i) => {
      const medalla = medallas[i] || `*${i + 1}.*`;
      texto += `${medalla} @${getId(user.id)} ${user.admin} *${user.name}* - *${user.msgs}* mensajes\n`;
    });

    const fantasmas = ranking.filter(u => u.msgs === 0).length;
    texto += `\n💀 *Fantasmas:* ${fantasmas} usuarios con 0 msgs`;

    return sock.sendMessage(msg.chat, {
      text: texto,
      mentions: top10.map(u => u.id)
    }, { quoted: msg });
  },
};