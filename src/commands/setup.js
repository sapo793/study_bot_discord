import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';

// ── Estrutura do servidor ────────────────────────────────────────────────────

const CARGOS = [
  // Administração
  { nome: '👑 Rei Sapo',     cor: 0xF5C518, hoist: true,  mentionavel: true,  permAdmin: true  },
  { nome: '🛡️ Guardião',    cor: 0x5865F2, hoist: true,  mentionavel: true,  permAdmin: false, permMod: true },
  { nome: '⚔️ Mod Anfíbio', cor: 0xED4245, hoist: true,  mentionavel: true,  permAdmin: false, permMod: true },
  // Níveis
  { nome: '👑 Sapo Lend.',   cor: 0xFFD700, hoist: true,  mentionavel: false, permAdmin: false },
  { nome: '🚀 Sapo Arq.',    cor: 0xFF8C00, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '⚙️ Sapo Eng.',   cor: 0x00CED1, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '💻 Sapo Prog.',   cor: 0x3CB371, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '🐛 Girino Dev',   cor: 0x90EE90, hoist: false, mentionavel: false, permAdmin: false },
  // Especialidades
  { nome: '🐍 Python',       cor: 0x3572A5, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '☕ Java',         cor: 0xB07219, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '🌐 Web Dev',      cor: 0xF1E05A, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '🤖 Bot Maker',    cor: 0xA855F7, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '🗄️ Database',   cor: 0x4479A1, hoist: false, mentionavel: false, permAdmin: false },
  { nome: '🎮 Game Dev',     cor: 0xEB7B59, hoist: false, mentionavel: false, permAdmin: false },
  // Base
  { nome: '🐸 Sapo',         cor: 0x57F287, hoist: false, mentionavel: false, permAdmin: false },
];

const ESTRUTURA = [
  {
    categoria: '📢 INFORMAÇÕES',
    canais: [
      { nome: '📌・boas-vindas',  tipo: 'texto', soLeitura: true,  topico: 'Bem-vindo à lagoa! 🐸'                      },
      { nome: '📋・regras',       tipo: 'texto', soLeitura: true,  topico: 'Leia antes de entrar na lagoa!'             },
      { nome: '📣・anúncios',     tipo: 'texto', soLeitura: true,  topico: 'Novidades da lagoa 🗞️'                     },
      { nome: '📅・eventos',      tipo: 'texto', soLeitura: false, topico: 'Eventos e atividades da comunidade'         },
      { nome: '🎭・cargos',       tipo: 'texto', soLeitura: true,  topico: 'Escolha suas especialidades aqui!'          },
    ]
  },
  {
    categoria: '🐸 COMUNIDADE',
    canais: [
      { nome: '💬・geral',               tipo: 'texto', soLeitura: false, topico: 'Papo geral da lagoa 🐸'              },
      { nome: '👋・apresentações',        tipo: 'texto', soLeitura: false, topico: 'Se apresente pra galera!'            },
      { nome: '🎮・games',               tipo: 'texto', soLeitura: false, topico: 'Jogos e diversão'                    },
      { nome: '🐸・memes-da-lagoa',      tipo: 'texto', soLeitura: false, topico: 'Memes e sapos engraçados'            },
      { nome: '🖥️・prints-e-setup',     tipo: 'texto', soLeitura: false, topico: 'Mostre seu setup!'                   },
      { nome: '🎙️・voz-geral',          tipo: 'voz',   soLeitura: false, topico: null                                  },
    ]
  },
  {
    categoria: '💻 PROGRAMAÇÃO',
    canais: [
      { nome: '🐍・python',              tipo: 'texto', soLeitura: false, topico: 'Discussões sobre Python 🐍'          },
      { nome: '☕・java',               tipo: 'texto', soLeitura: false, topico: 'Java e afins ☕'                      },
      { nome: '🌐・web-dev',            tipo: 'texto', soLeitura: false, topico: 'HTML, CSS, JS e frameworks 🌐'        },
      { nome: '⚙️・backend',           tipo: 'texto', soLeitura: false, topico: 'APIs, servidores e back-end'          },
      { nome: '🗄️・banco-de-dados',   tipo: 'texto', soLeitura: false, topico: 'SQL, NoSQL e além'                    },
      { nome: '🤖・bots-discord',       tipo: 'texto', soLeitura: false, topico: 'Criação de bots para o Discord'       },
      { nome: '🎮・game-dev',           tipo: 'texto', soLeitura: false, topico: 'Desenvolvimento de jogos'             },
      { nome: '🆘・ajuda-geral',        tipo: 'texto', soLeitura: false, topico: 'Travou? Pede ajuda aqui!'            },
      { nome: '🤝・pair-programming',   tipo: 'texto', soLeitura: false, topico: 'Procure alguém pra codar junto'       },
      { nome: '🖥️・voz-código',        tipo: 'voz',   soLeitura: false, topico: null                                  },
    ]
  },
  {
    categoria: '🚀 PROJETOS',
    canais: [
      { nome: '🏆・showcase',           tipo: 'texto', soLeitura: false, topico: 'Mostre seus projetos!'               },
      { nome: '💡・ideias',             tipo: 'texto', soLeitura: false, topico: 'Compartilhe suas ideias'              },
      { nome: '🔍・code-review',        tipo: 'texto', soLeitura: false, topico: 'Peça revisão de código'              },
      { nome: '📂・recursos',           tipo: 'texto', soLeitura: false, topico: 'Links, tutoriais e materiais úteis'   },
    ]
  },
  {
    categoria: '📚 ESTUDOS',
    canais: [
      { nome: '🤖・bot-estudos',        tipo: 'texto', soLeitura: false, topico: 'Use os comandos do StudyBot aqui!'   },
      { nome: '📋・checklists',         tipo: 'texto', soLeitura: false, topico: 'Gerencie suas listas de tarefas'      },
      { nome: '📅・prazos',             tipo: 'texto', soLeitura: false, topico: 'Não perca nenhuma entrega!'          },
      { nome: '📝・resumos',            tipo: 'texto', soLeitura: false, topico: 'Compartilhe resumos e anotações'      },
      { nome: '🃏・flashcards',         tipo: 'texto', soLeitura: false, topico: 'Flashcards e quizzes'                },
    ]
  },
  {
    categoria: '🔧 MODERAÇÃO',
    canais: [
      { nome: '📋・logs',               tipo: 'texto', soLeitura: true,  topico: 'Logs do servidor', modOnly: true      },
      { nome: '🔨・staff-chat',         tipo: 'texto', soLeitura: false, topico: 'Chat da equipe',   modOnly: true      },
    ]
  },
];

// ── Mensagens automáticas ────────────────────────────────────────────────────

function embedBoasVindas(guild) {
  return new EmbedBuilder()
    .setTitle('🐸 Bem-vindo à Toca do Sapo!')
    .setDescription(
      '> *Onde os sapos programam, aprendem e evoluem.* 🚀\n\n' +
      'Fico feliz em te ver aqui, girino! Esta é a sua nova lagoa — um lugar pra aprender, compartilhar e crescer junto com outros desenvolvedores sapos.\n\n' +
      '**Por onde começar:**\n' +
      '📋 Leia as **#📋・regras** antes de qualquer coisa\n' +
      '🎭 Vá em **#🎭・cargos** para escolher suas especialidades\n' +
      '👋 Se apresente em **#👋・apresentações**\n' +
      '🤖 Use o **StudyBot** em **#🤖・bot-estudos**'
    )
    .setColor(0x57F287)
    .setThumbnail(guild.iconURL({ dynamic: true }) ?? null)
    .setFooter({ text: `${guild.name} • Boa sorte na jornada! 🐸` })
    .setTimestamp();
}

function embedRegras() {
  return new EmbedBuilder()
    .setTitle('📋 Regras da Lagoa')
    .setDescription('Leia com atenção. Todos os anfíbios devem seguir estas regras.')
    .setColor(0xFEE75C)
    .addFields(
      { name: '1️⃣  Respeite todos os anfíbios 🐸', value: 'Sem discriminação, assédio ou toxicidade. Lagoa segura para todos.' },
      { name: '2️⃣  Conteúdo no canal correto',      value: 'Poste dúvidas de Python em **#python**, memes em **#memes-da-lagoa** e assim por diante.' },
      { name: '3️⃣  Sem spam ou flood na lagoa',     value: 'Mensagens repetidas, flood de emojis ou ping desnecessário são proibidos.' },
      { name: '4️⃣  Nada ilegal ou pirata',          value: 'Zero tolerância com conteúdo ilegal, piracy ou distribuição de software sem licença.' },
      { name: '5️⃣  Se divirta e evolua! 🚀',        value: 'Compartilhe seu conhecimento, ajude outros girinhos e cresça junto com a comunidade.' },
    )
    .setFooter({ text: 'Descumprir as regras pode resultar em kick ou ban da lagoa.' });
}

function embedCargos() {
  return new EmbedBuilder()
    .setTitle('🎭 Escolha suas Especialidades')
    .setDescription('Reaja ou peça a um moderador para receber os cargos de especialidade.')
    .setColor(0xA855F7)
    .addFields(
      { name: '🐍 Python',    value: 'Desenvolvimento com Python',         inline: true },
      { name: '☕ Java',      value: 'Desenvolvimento com Java',           inline: true },
      { name: '🌐 Web Dev',   value: 'Front-end e frameworks web',        inline: true },
      { name: '🤖 Bot Maker', value: 'Criação de bots para Discord',      inline: true },
      { name: '🗄️ Database', value: 'Bancos de dados SQL e NoSQL',       inline: true },
      { name: '🎮 Game Dev',  value: 'Desenvolvimento de jogos',          inline: true },
    )
    .setFooter({ text: 'Peça a um Mod Anfíbio para receber seu cargo.' });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function progress(atual, total) {
  const filled = Math.floor((atual / total) * 20);
  return '`' + '█'.repeat(filled) + '░'.repeat(20 - filled) + `\` ${atual}/${total}`;
}

async function editarProgresso(msg, texto) {
  try { await msg.edit({ content: texto }); } catch { /* ignora */ }
}

// ── Comando ──────────────────────────────────────────────────────────────────

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('🐸 Monta toda a estrutura da Toca do Sapo automaticamente')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Apenas **administradores** podem usar este comando.', ephemeral: true });
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('🐸 Iniciando setup da Toca do Sapo...')
          .setDescription('Preparando a lagoa. Isso pode levar alguns segundos...')
          .setColor(0x57F287)
      ],
      ephemeral: true
    });

    const msg = await interaction.fetchReply();
    const guild = interaction.guild;
    const criados = { cargos: {}, categorias: {}, canais: {} };

    // ── 1. Cargos ────────────────────────────────────────────────────────────
    await editarProgresso(msg, `⚙️ **[1/4]** Criando cargos... ${progress(0, CARGOS.length)}`);

    let everyoneRole = guild.roles.everyone;

    for (let i = 0; i < CARGOS.length; i++) {
      const def = CARGOS[i];
      const existente = guild.roles.cache.find(r => r.name === def.nome);
      if (existente) {
        criados.cargos[def.nome] = existente;
      } else {
        const permissoes = [];
        if (def.permAdmin) permissoes.push(PermissionFlagsBits.Administrator);
        if (def.permMod) {
          permissoes.push(
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.MuteMembers,
          );
        }
        const role = await guild.roles.create({
          name: def.nome,
          color: def.cor,
          hoist: def.hoist,
          mentionable: def.mentionavel,
          permissions: permissoes,
        });
        criados.cargos[def.nome] = role;
      }
      await editarProgresso(msg, `⚙️ **[1/4]** Criando cargos... ${progress(i + 1, CARGOS.length)}`);
    }

    const modRoles = [
      criados.cargos['👑 Rei Sapo'],
      criados.cargos['🛡️ Guardião'],
      criados.cargos['⚔️ Mod Anfíbio'],
    ].filter(Boolean);

    // ── 2. Deletar canais existentes (opcional — pula se já tiver conteúdo) ──
    const totalItens = ESTRUTURA.reduce((acc, cat) => acc + 1 + cat.canais.length, 0);
    let progAtual = 0;

    // ── 3. Categorias e canais ───────────────────────────────────────────────
    await editarProgresso(msg, `🏗️ **[2/4]** Criando categorias e canais... ${progress(0, totalItens)}`);

    for (const bloco of ESTRUTURA) {
      // Categoria
      let categoria = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name === bloco.categoria
      );
      if (!categoria) {
        const permsCat = bloco.categoria.includes('MODERAÇÃO')
          ? [
              { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
              ...modRoles.map(r => ({ id: r.id, allow: [PermissionFlagsBits.ViewChannel] })),
            ]
          : [];
        categoria = await guild.channels.create({
          name: bloco.categoria,
          type: ChannelType.GuildCategory,
          permissionOverwrites: permsCat,
        });
      }
      criados.categorias[bloco.categoria] = categoria;
      progAtual++;
      await editarProgresso(msg, `🏗️ **[2/4]** Criando categorias e canais... ${progress(progAtual, totalItens)}`);

      // Canais
      for (const def of bloco.canais) {
        const existente = guild.channels.cache.find(c => c.name === def.nome.replace(/[^a-z0-9\-]/gi, '').toLowerCase() || c.name === def.nome);

        if (!existente) {
          const perms = [];

          if (def.modOnly) {
            perms.push({ id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] });
            modRoles.forEach(r => perms.push({ id: r.id, allow: [PermissionFlagsBits.ViewChannel] }));
          } else if (def.soLeitura) {
            perms.push({
              id: everyoneRole.id,
              deny: [PermissionFlagsBits.SendMessages],
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
            });
            modRoles.forEach(r => perms.push({ id: r.id, allow: [PermissionFlagsBits.SendMessages] }));
          }

          const canal = await guild.channels.create({
            name: def.nome,
            type: def.tipo === 'voz' ? ChannelType.GuildVoice : ChannelType.GuildText,
            parent: categoria.id,
            topic: def.topico ?? undefined,
            permissionOverwrites: perms,
          });
          criados.canais[def.nome] = canal;
        } else {
          criados.canais[def.nome] = existente;
        }

        progAtual++;
        await editarProgresso(msg, `🏗️ **[2/4]** Criando categorias e canais... ${progress(progAtual, totalItens)}`);
      }
    }

    // ── 4. Mensagens automáticas ─────────────────────────────────────────────
    await editarProgresso(msg, `💬 **[3/4]** Enviando mensagens de boas-vindas...`);

    const enviar = async (nomeCanal, ...conteudo) => {
      const canal = Object.values(criados.canais).find(c => c?.name?.includes(
        nomeCanal.replace(/[🐸📋📣📅🎭💬👋🎮🖥️🤖📌⚙️🐍☕🌐🤝🗄️🏆💡🔍📂📝🃏📋⚔️🛡️👑🔨]/gu, '').trim()
      ));
      if (!canal?.isTextBased()) return;
      for (const item of conteudo) {
        if (item instanceof EmbedBuilder) await canal.send({ embeds: [item] });
        else await canal.send(item);
      }
    };

    try {
      await enviar('boas-vindas', embedBoasVindas(guild));
      await enviar('regras', embedRegras());
      await enviar('cargos', embedCargos());
    } catch (e) {
      console.warn('[Setup] Aviso ao enviar mensagens:', e.message);
    }

    // ── 5. Cargo padrão (@everyone → 🐸 Sapo) ───────────────────────────────
    await editarProgresso(msg, `🎭 **[4/4]** Finalizando permissões...`);

    // ── Concluído ────────────────────────────────────────────────────────────
    const totalCargos  = Object.keys(criados.cargos).length;
    const totalCanais  = Object.keys(criados.canais).length;
    const totalCats    = Object.keys(criados.categorias).length;

    await interaction.editReply({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Toca do Sapo montada com sucesso!')
          .setDescription('A lagoa está pronta pra receber os girinhos. 🐸🚀')
          .setColor(0x57F287)
          .addFields(
            { name: '🎭 Cargos criados',     value: `${totalCargos}`,            inline: true },
            { name: '📁 Categorias',         value: `${totalCats}`,              inline: true },
            { name: '💬 Canais',             value: `${totalCanais}`,            inline: true },
            { name: '📌 Próximos passos', value:
              '• Configure o bot de boas-vindas para mencionar novos membros em **#📌・boas-vindas**\n' +
              '• Adicione reações em **#🎭・cargos** para entrega automática de cargos\n' +
              '• Convide os membros e divirta-se! 🐸'
            }
          )
          .setFooter({ text: 'StudyBot • /ajuda para ver todos os comandos' })
          .setTimestamp()
      ]
    });
  }
};
