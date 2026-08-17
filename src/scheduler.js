import { EmbedBuilder } from 'discord.js';
import { getAllPrazos, markNotified } from './storage.js';

// Níveis de notificação em dias antes do prazo
const NIVEIS = [7, 3, 1, 0];

function diasRestantes(isoDate) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(isoDate);
  prazo.setHours(0, 0, 0, 0);
  return Math.round((prazo - hoje) / 86400000);
}

function buildEmbed(prazo, dias) {
  let cor, titulo, subtitulo;

  if (dias === 0) {
    cor = 0xEF4444; titulo = '🚨 ENTREGA HOJE!'; subtitulo = 'O prazo é **hoje**. Boa sorte!';
  } else if (dias === 1) {
    cor = 0xF97316; titulo = '🔴 Prazo amanhã!'; subtitulo = 'Falta **1 dia** para a entrega.';
  } else if (dias === 3) {
    cor = 0xF59E0B; titulo = '🟠 Prazo em 3 dias'; subtitulo = 'Faltam **3 dias** para a entrega.';
  } else {
    cor = 0xFACC15; titulo = '🟡 Lembrete de prazo'; subtitulo = `Faltam **${dias} dias** para a entrega.`;
  }

  const embed = new EmbedBuilder()
    .setTitle(titulo)
    .setColor(cor)
    .setDescription(subtitulo)
    .addFields({ name: '📚 Trabalho', value: prazo.trabalho, inline: true })
    .addFields({ name: '📆 Data de entrega', value: new Date(prazo.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }), inline: true })
    .setTimestamp();

  if (prazo.descricao) embed.addFields({ name: '📝 Descrição', value: prazo.descricao });

  return embed;
}

async function verificarPrazos(client) {
  const todosOsPrazos = getAllPrazos();

  for (const [guildId, prazos] of Object.entries(todosOsPrazos)) {
    for (const prazo of prazos) {
      const dias = diasRestantes(prazo.data);

      // Ignora prazos muito no futuro ou vencidos há mais de 1 dia
      if (dias > 7 || dias < 0) continue;

      for (const nivel of NIVEIS) {
        if (dias !== nivel) continue;
        if (prazo.notified?.includes(nivel)) continue;

        try {
          const channel = await client.channels.fetch(prazo.channelId).catch(() => null);
          if (!channel?.isTextBased()) continue;

          const mention = prazo.userId ? `<@${prazo.userId}>` : '';
          await channel.send({ content: mention, embeds: [buildEmbed(prazo, dias)] });
          markNotified(guildId, prazo.id, nivel);
        } catch (err) {
          console.error(`[Scheduler] Erro ao notificar prazo ${prazo.id}:`, err.message);
        }
      }
    }
  }
}

export function startScheduler(client) {
  // Verifica imediatamente ao iniciar e depois a cada hora
  verificarPrazos(client);
  setInterval(() => verificarPrazos(client), 60 * 60 * 1000);
  console.log('⏰ Scheduler de prazos iniciado (verifica a cada hora)');
}
