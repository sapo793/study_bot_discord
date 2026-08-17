import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getPrazos, addPrazo, removePrazo } from '../storage.js';

function parseData(str) {
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match.map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

function formatData(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
  });
}

function diasRestantes(date) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(date);
  prazo.setHours(0, 0, 0, 0);
  return Math.round((prazo - hoje) / 86400000);
}

function statusEmoji(dias) {
  if (dias < 0) return '🔴';
  if (dias === 0) return '🚨';
  if (dias <= 1) return '🔴';
  if (dias <= 3) return '🟠';
  if (dias <= 7) return '🟡';
  return '🟢';
}

export default {
  data: new SlashCommandBuilder()
    .setName('prazo')
    .setDescription('Gerencie prazos de entrega de trabalhos')
    .addSubcommand(sub =>
      sub.setName('adicionar')
        .setDescription('Adiciona um prazo de entrega')
        .addStringOption(o =>
          o.setName('trabalho').setDescription('Nome do trabalho/disciplina').setRequired(true))
        .addStringOption(o =>
          o.setName('data').setDescription('Data de entrega (DD/MM/AAAA)').setRequired(true))
        .addStringOption(o =>
          o.setName('descricao').setDescription('Descrição opcional').setRequired(false))
        .addChannelOption(o =>
          o.setName('canal').setDescription('Canal para receber notificações (padrão: este canal)').setRequired(false)))
    .addSubcommand(sub =>
      sub.setName('listar')
        .setDescription('Lista todos os prazos do servidor'))
    .addSubcommand(sub =>
      sub.setName('remover')
        .setDescription('Remove um prazo pelo ID')
        .addStringOption(o =>
          o.setName('id').setDescription('ID do prazo (visto em /prazo listar)').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (sub === 'adicionar') {
      const trabalho = interaction.options.getString('trabalho').trim();
      const dataStr = interaction.options.getString('data').trim();
      const descricao = interaction.options.getString('descricao')?.trim() ?? null;
      const canal = interaction.options.getChannel('canal') ?? interaction.channel;

      const data = parseData(dataStr);
      if (!data) {
        return interaction.reply({
          content: '❌ Data inválida. Use o formato **DD/MM/AAAA** (ex: 20/06/2025).',
          ephemeral: true
        });
      }

      const dias = diasRestantes(data);
      if (dias < 0) {
        return interaction.reply({
          content: '❌ A data informada já passou.',
          ephemeral: true
        });
      }

      const id = addPrazo(guildId, {
        trabalho,
        data: data.toISOString(),
        descricao,
        channelId: canal.id,
        userId: interaction.user.id,
        notified: []
      });

      const embed = new EmbedBuilder()
        .setTitle('📅 Prazo adicionado!')
        .setColor(0x3B82F6)
        .addFields(
          { name: '📚 Trabalho', value: trabalho, inline: true },
          { name: '📆 Data', value: formatData(data), inline: true },
          { name: '⏳ Dias restantes', value: `${dias} dia(s)`, inline: true }
        )
        .setFooter({ text: `ID: ${id} • Notificações em: ${canal.name}` });

      if (descricao) embed.setDescription(descricao);

      await interaction.reply({ embeds: [embed] });
    }

    else if (sub === 'listar') {
      const prazos = getPrazos(guildId);

      if (prazos.length === 0) {
        return interaction.reply({
          content: '📭 Nenhum prazo cadastrado. Use `/prazo adicionar` para começar.',
          ephemeral: true
        });
      }

      const ordenados = [...prazos].sort((a, b) => new Date(a.data) - new Date(b.data));

      const embed = new EmbedBuilder()
        .setTitle('📅 Prazos de Entrega')
        .setColor(0x3B82F6)
        .setTimestamp();

      for (const p of ordenados) {
        const dias = diasRestantes(p.data);
        const emoji = statusEmoji(dias);
        const diasText = dias < 0 ? 'Vencido!' : dias === 0 ? 'Hoje!' : `${dias} dia(s)`;
        embed.addFields({
          name: `${emoji} ${p.trabalho}`,
          value: [
            `📆 **${formatData(p.data)}** — ${diasText}`,
            p.descricao ? `📝 ${p.descricao}` : null,
            `🆔 \`${p.id}\``
          ].filter(Boolean).join('\n'),
          inline: false
        });
      }

      await interaction.reply({ embeds: [embed] });
    }

    else if (sub === 'remover') {
      const id = interaction.options.getString('id').trim();
      const removido = removePrazo(guildId, id);

      if (!removido) {
        return interaction.reply({
          content: `❌ Prazo com ID \`${id}\` não encontrado.`,
          ephemeral: true
        });
      }

      await interaction.reply({ content: `🗑️ Prazo \`${id}\` removido com sucesso.`, ephemeral: true });
    }
  }
};
