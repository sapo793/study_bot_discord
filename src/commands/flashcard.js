import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { gerarSemHistorico } from '../gemini.js';

export default {
  data: new SlashCommandBuilder()
    .setName('flashcard')
    .setDescription('Gera flashcards para memorização de qualquer tema')
    .addStringOption(opt =>
      opt
        .setName('tema')
        .setDescription('Ex: capitais do mundo, fórmulas de física, verbos irregulares inglês')
        .setRequired(true)
        .setMaxLength(200)
    )
    .addIntegerOption(opt =>
      opt
        .setName('quantidade')
        .setDescription('Número de flashcards (padrão: 5)')
        .setMinValue(1)
        .setMaxValue(8)
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const tema = interaction.options.getString('tema');
    const qtd = interaction.options.getInteger('quantidade') ?? 5;

    const prompt = `Crie ${qtd} flashcards sobre "${tema}" para estudo e memorização.

Formato OBRIGATÓRIO — responda APENAS com JSON válido, sem markdown, sem explicações:
{
  "flashcards": [
    { "frente": "pergunta ou conceito", "verso": "resposta ou definição curta" }
  ]
}

Regras:
- Frente: pergunta direta ou conceito (máx. 80 chars)
- Verso: resposta concisa e completa (máx. 150 chars)
- Cubra os aspectos mais importantes do tema
- Varie entre definições, exemplos, datas, fórmulas conforme o tema`;

    const raw = await gerarSemHistorico(prompt);

    let flashcards;
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      flashcards = JSON.parse(cleaned).flashcards;
      if (!Array.isArray(flashcards)) throw new Error('Formato inválido');
    } catch {
      await interaction.editReply({
        content: '⚠️ Não consegui gerar os flashcards. Tente novamente com um tema mais específico.'
      });
      return;
    }

    // Envia o primeiro flashcard e navega pelos demais com botões
    let index = 0;
    let mostrandoVerso = false;

    const gerarEmbed = () => new EmbedBuilder()
      .setTitle(`🃏 Flashcard ${index + 1}/${flashcards.length} — ${tema}`)
      .setDescription(
        mostrandoVerso
          ? `**✅ Verso:**\n${flashcards[index].verso}`
          : `**❓ Frente:**\n${flashcards[index].frente}`
      )
      .setColor(mostrandoVerso ? 0x34A853 : 0x4285F4)
      .setFooter({ text: mostrandoVerso ? 'Clique em "Virar" para ver a pergunta' : 'Clique em "Virar" para ver a resposta' });

    const gerarBotoes = () => new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('◀ Anterior')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(index === 0),
      new ButtonBuilder()
        .setCustomId('flip')
        .setLabel(mostrandoVerso ? '🔄 Ver frente' : '🔄 Virar')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Próximo ▶')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(index === flashcards.length - 1)
    );

    const msg = await interaction.editReply({
      embeds: [gerarEmbed()],
      components: [gerarBotoes()]
    });

    // Coleta interações por 5 minutos
    const collector = msg.createMessageComponentCollector({ time: 5 * 60 * 1000 });

    collector.on('collect', async btn => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({ content: '❌ Apenas quem criou os flashcards pode navegar.', ephemeral: true });
      }

      if (btn.customId === 'prev') { index--; mostrandoVerso = false; }
      else if (btn.customId === 'next') { index++; mostrandoVerso = false; }
      else if (btn.customId === 'flip') { mostrandoVerso = !mostrandoVerso; }

      await btn.update({ embeds: [gerarEmbed()], components: [gerarBotoes()] });
    });

    collector.on('end', async () => {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('expired').setLabel('⏱ Sessão expirada').setStyle(ButtonStyle.Secondary).setDisabled(true)
      );
      await interaction.editReply({ components: [row] }).catch(() => {});
    });
  }
};
