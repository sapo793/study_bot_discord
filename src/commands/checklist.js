import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {
  getChecklists, saveChecklist, deleteChecklist
} from '../storage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('checklist')
    .setDescription('Gerencie suas checklists de estudo')
    .addSubcommand(sub =>
      sub.setName('criar')
        .setDescription('Cria uma nova checklist')
        .addStringOption(o =>
          o.setName('nome').setDescription('Nome da checklist').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('adicionar')
        .setDescription('Adiciona um item à checklist')
        .addStringOption(o =>
          o.setName('nome').setDescription('Nome da checklist').setRequired(true)
            .setAutocomplete(true))
        .addStringOption(o =>
          o.setName('item').setDescription('Texto do item').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('marcar')
        .setDescription('Marca/desmarca um item como concluído')
        .addStringOption(o =>
          o.setName('nome').setDescription('Nome da checklist').setRequired(true)
            .setAutocomplete(true))
        .addIntegerOption(o =>
          o.setName('numero').setDescription('Número do item').setRequired(true).setMinValue(1)))
    .addSubcommand(sub =>
      sub.setName('ver')
        .setDescription('Exibe uma checklist')
        .addStringOption(o =>
          o.setName('nome').setDescription('Nome da checklist').setRequired(true)
            .setAutocomplete(true)))
    .addSubcommand(sub =>
      sub.setName('apagar')
        .setDescription('Apaga uma checklist inteira')
        .addStringOption(o =>
          o.setName('nome').setDescription('Nome da checklist').setRequired(true)
            .setAutocomplete(true))),

  async autocomplete(interaction) {
    const checklists = getChecklists(interaction.guildId, interaction.user.id);
    const names = Object.keys(checklists);
    const focused = interaction.options.getFocused().toLowerCase();
    const filtered = names.filter(n => n.toLowerCase().includes(focused)).slice(0, 25);
    await interaction.respond(filtered.map(n => ({ name: n, value: n })));
  },

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    if (sub === 'criar') {
      const nome = interaction.options.getString('nome').trim();
      const checklists = getChecklists(guildId, userId);

      if (checklists[nome]) {
        return interaction.reply({
          content: `❌ Já existe uma checklist chamada **${nome}**.`,
          ephemeral: true
        });
      }

      saveChecklist(guildId, userId, nome, []);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('✅ Checklist criada!')
            .setDescription(`**${nome}** está pronta.\nUse \`/checklist adicionar\` para colocar itens.`)
            .setColor(0x22C55E)
        ],
        ephemeral: true
      });
    }

    else if (sub === 'adicionar') {
      const nome = interaction.options.getString('nome').trim();
      const item = interaction.options.getString('item').trim();
      const checklists = getChecklists(guildId, userId);

      if (!checklists[nome]) {
        return interaction.reply({
          content: `❌ Checklist **${nome}** não encontrada. Crie com \`/checklist criar\`.`,
          ephemeral: true
        });
      }

      checklists[nome].push({ texto: item, feito: false });
      saveChecklist(guildId, userId, nome, checklists[nome]);

      await interaction.reply({
        content: `➕ Item **"${item}"** adicionado à checklist **${nome}**.`,
        ephemeral: true
      });
    }

    else if (sub === 'marcar') {
      const nome = interaction.options.getString('nome').trim();
      const numero = interaction.options.getInteger('numero');
      const checklists = getChecklists(guildId, userId);

      if (!checklists[nome]) {
        return interaction.reply({ content: `❌ Checklist **${nome}** não encontrada.`, ephemeral: true });
      }

      const items = checklists[nome];
      const idx = numero - 1;

      if (idx < 0 || idx >= items.length) {
        return interaction.reply({
          content: `❌ Item número **${numero}** não existe. A lista tem ${items.length} item(ns).`,
          ephemeral: true
        });
      }

      items[idx].feito = !items[idx].feito;
      saveChecklist(guildId, userId, nome, items);

      const status = items[idx].feito ? '✅ concluído' : '🔲 desmarcado';
      await interaction.reply({
        content: `Item **${numero}. ${items[idx].texto}** marcado como ${status}.`,
        ephemeral: true
      });
    }

    else if (sub === 'ver') {
      const nome = interaction.options.getString('nome').trim();
      const checklists = getChecklists(guildId, userId);

      if (!checklists[nome]) {
        return interaction.reply({ content: `❌ Checklist **${nome}** não encontrada.`, ephemeral: true });
      }

      const items = checklists[nome];
      const feitos = items.filter(i => i.feito).length;

      const descricao = items.length === 0
        ? '*Nenhum item ainda. Use `/checklist adicionar`.*'
        : items.map((i, idx) =>
            `${i.feito ? '✅' : '🔲'} **${idx + 1}.** ${i.texto}`
          ).join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`📋 ${nome}`)
        .setDescription(descricao)
        .setColor(0x7C3AED)
        .setFooter({ text: `${feitos}/${items.length} concluído(s)` });

      if (items.length > 0) {
        const pct = Math.round((feitos / items.length) * 100);
        const barra = '█'.repeat(Math.floor(pct / 10)) + '░'.repeat(10 - Math.floor(pct / 10));
        embed.addFields({ name: 'Progresso', value: `\`${barra}\` ${pct}%` });
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (sub === 'apagar') {
      const nome = interaction.options.getString('nome').trim();
      const checklists = getChecklists(guildId, userId);

      if (!checklists[nome]) {
        return interaction.reply({ content: `❌ Checklist **${nome}** não encontrada.`, ephemeral: true });
      }

      deleteChecklist(guildId, userId, nome);
      await interaction.reply({
        content: `🗑️ Checklist **${nome}** apagada com sucesso.`,
        ephemeral: true
      });
    }
  }
};
