import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { gerarSemHistorico } from '../gemini.js';

export default {
  data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Gera um quiz de múltipla escolha sobre qualquer tema')
    .addStringOption(opt =>
      opt
        .setName('tema')
        .setDescription('Ex: fotossíntese, Segunda Guerra Mundial, álgebra linear')
        .setRequired(true)
        .setMaxLength(200)
    )
    .addIntegerOption(opt =>
      opt
        .setName('quantidade')
        .setDescription('Número de perguntas (padrão: 3)')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt
        .setName('dificuldade')
        .setDescription('Nível de dificuldade (padrão: médio)')
        .addChoices(
          { name: '🟢 Fácil', value: 'fácil' },
          { name: '🟡 Médio', value: 'médio' },
          { name: '🔴 Difícil', value: 'difícil' }
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const tema = interaction.options.getString('tema');
    const qtd = interaction.options.getInteger('quantidade') ?? 3;
    const dificuldade = interaction.options.getString('dificuldade') ?? 'médio';

    const prompt = `Crie exatamente ${qtd} perguntas de múltipla escolha sobre "${tema}" com nível de dificuldade ${dificuldade}.

Para cada pergunta use EXATAMENTE este formato:

**❓ Pergunta N:** [enunciado claro da pergunta]
A) [alternativa]
B) [alternativa]
C) [alternativa]
D) [alternativa]
✅ **Resposta:** [letra]) — [explicação breve do porquê está certa]

---

Regras:
- As alternativas incorretas devem ser plausíveis (não óbvias demais)
- A explicação deve ser educativa, não apenas confirmar a resposta
- Separe cada pergunta com ---
- Não numere as perguntas com números arábicos antes do "Pergunta N"`;

    const quiz = await gerarSemHistorico(prompt);

    const embed = new EmbedBuilder()
      .setTitle(`🧠 Quiz — ${tema}`)
      .setDescription(quiz.length > 4000 ? quiz.slice(0, 3990) + '\n*[truncado]*' : quiz)
      .setColor(0x34A853)
      .addFields(
        { name: '📊 Perguntas', value: `${qtd}`, inline: true },
        { name: '⚡ Dificuldade', value: dificuldade, inline: true },
        { name: '📖 Tema', value: tema, inline: true }
      )
      .setFooter({ text: 'Tente responder antes de ver o gabarito! 💪' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
