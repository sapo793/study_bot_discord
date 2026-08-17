import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { gerarSemHistorico } from '../gemini.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resumo')
    .setDescription('Gera um resumo didático e organizado sobre qualquer tópico')
    .addStringOption(opt =>
      opt
        .setName('topico')
        .setDescription('Ex: Revolução Francesa, Lei de Ohm, funções quadráticas')
        .setRequired(true)
        .setMaxLength(200)
    )
    .addStringOption(opt =>
      opt
        .setName('nivel')
        .setDescription('Nível do resumo (padrão: intermediário)')
        .addChoices(
          { name: '🎒 Básico (ensino fundamental/médio)', value: 'básico' },
          { name: '📘 Intermediário (ensino médio/vestibular)', value: 'intermediário' },
          { name: '🎓 Avançado (ensino superior)', value: 'avançado' }
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const topico = interaction.options.getString('topico');
    const nivel = interaction.options.getString('nivel') ?? 'intermediário';

    const prompt = `Crie um resumo didático sobre "${topico}" para nível ${nivel}.

Estrutura obrigatória:
📌 **O que é:** [definição clara em 1-2 frases]

🔑 **Pontos principais:**
• [ponto 1 com breve explicação]
• [ponto 2 com breve explicação]
• [ponto 3 com breve explicação]
(adicione mais se necessário)

💡 **Exemplo prático:** [exemplo concreto e fácil de entender]

⚠️ **Não confunda:** [uma armadilha ou erro comum sobre o tema]

📝 **Em uma frase:** [resumo do resumo — a ideia central]

Seja claro, objetivo e use linguagem adequada ao nível ${nivel}.
Limite total: 1600 caracteres.`;

    const resumo = await gerarSemHistorico(prompt);

    const embed = new EmbedBuilder()
      .setTitle(`📝 Resumo — ${topico}`)
      .setDescription(resumo.length > 4000 ? resumo.slice(0, 3990) + '\n*[truncado]*' : resumo)
      .setColor(0xFBBC04)
      .addFields(
        { name: '🎯 Nível', value: nivel, inline: true },
        { name: '📚 Tópico', value: topico, inline: true }
      )
      .setFooter({ text: 'Use /estudar para aprofundar qualquer ponto deste resumo!' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
