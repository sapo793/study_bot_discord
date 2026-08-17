import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { perguntarIA, limparSessao } from '../gemini.js';

export default {
  data: new SlashCommandBuilder()
    .setName('estudar')
    .setDescription('Tire dúvidas com a IA — mantém contexto da conversa')
    .addStringOption(opt =>
      opt
        .setName('pergunta')
        .setDescription('Sua dúvida, tópico ou exercício')
        .setRequired(true)
        .setMaxLength(800)
    )
    .addBooleanOption(opt =>
      opt
        .setName('resetar')
        .setDescription('Reinicia o histórico de conversa (padrão: false)')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const pergunta = interaction.options.getString('pergunta');
    const resetar = interaction.options.getBoolean('resetar') ?? false;
    const userId = interaction.user.id;

    if (resetar) {
      limparSessao(userId);
    }

    const resposta = await perguntarIA(userId, pergunta);

    // Trunca se necessário (limite do Discord: 4096 chars em embed description)
    const respostaTruncada = resposta.length > 4000
      ? resposta.slice(0, 3990) + '\n\n*[resposta truncada]*'
      : resposta;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.displayName} perguntou:`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTitle('📚 Assistente de Estudos')
      .setDescription(respostaTruncada)
      .setColor(0x4285F4)
      .setFooter({
        text: resetar
          ? '🔄 Histórico reiniciado • Use /estudar para continuar'
          : '💬 Contexto salvo • Continue perguntando!'
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
