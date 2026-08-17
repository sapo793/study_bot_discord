import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { totalSessoesAtivas } from '../gemini.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Mostra todos os comandos disponíveis do StudyBot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📚 StudyBot — Comandos')
      .setDescription('Seu assistente de estudos com Inteligência Artificial Gemini!')
      .setColor(0x7C3AED)
      .addFields(
        {
          name: '💬 /estudar [pergunta]',
          value: 'Tire dúvidas com a IA. Mantém o contexto da conversa por até 2 horas.\n`resetar: true` para limpar o histórico.',
          inline: false
        },
        {
          name: '🧠 /quiz [tema] [quantidade] [dificuldade]',
          value: 'Gera um quiz de múltipla escolha com gabarito comentado.\nDificuldades: fácil, médio, difícil.',
          inline: false
        },
        {
          name: '📝 /resumo [tópico] [nível]',
          value: 'Resumo didático e estruturado.\nNíveis: básico, intermediário, avançado.',
          inline: false
        },
        {
          name: '🃏 /flashcard [tema] [quantidade]',
          value: 'Flashcards interativos para memorização.\nNavegue com botões e vire os cards!',
          inline: false
        },
        {
          name: '📋 /checklist [subcomando]',
          value: 'Crie e gerencie checklists de estudo.\nSubcomandos: `criar`, `adicionar`, `marcar`, `ver`, `apagar`.',
          inline: false
        },
        {
          name: '📅 /prazo [subcomando]',
          value: 'Cadastre prazos de entrega com notificações automáticas.\nSubcomandos: `adicionar`, `listar`, `remover`.\nAvisamos em 7, 3, 1 dia e no dia da entrega!',
          inline: false
        },
        {
          name: '🐸 /setup',
          value: 'Monta toda a estrutura da Toca do Sapo automaticamente.\nCria cargos, categorias, canais e mensagens. Apenas admins.',
          inline: false
        },
        {
          name: '❓ /ajuda',
          value: 'Mostra esta mensagem.',
          inline: false
        }
      )
      .addFields({
        name: '📊 Status',
        value: `🟢 Online | 🧑‍🎓 ${totalSessoesAtivas()} sessão(ões) ativa(s)`,
        inline: false
      })
      .setFooter({ text: 'Powered by Google Gemini 1.5 Flash' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
