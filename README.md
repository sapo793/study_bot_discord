# 📚 StudyBot — Discord Bot com Gemini AI

Bot de estudos para Discord integrado ao Google Gemini AI. Ajuda estudantes a tirar dúvidas, criar quizzes, gerar flashcards, resumos e gerenciar checklists e prazos de entrega, tudo via slash commands.

---

## ✨ Funcionalidades

| Comando | Descrição |
|---|---|
| `/estudar` | Tire dúvidas com a IA mantendo histórico de conversa por usuário |
| `/quiz` | Gera quiz de múltipla escolha com gabarito e explicações |
| `/flashcard` | Cria flashcards interativos navegáveis com botões |
| `/resumo` | Gera resumos didáticos organizados por nível |
| `/checklist` | Crie e gerencie checklists de estudo com barra de progresso |
| `/prazo` | Cadastre prazos de entrega com notificações automáticas |
| `/ajuda` | Exibe todos os comandos disponíveis |

### Detalhes dos comandos

**`/estudar`**
- Mantém contexto da conversa por até 2 horas por usuário
- Opção de resetar o histórico com `resetar: true`

**`/quiz`**
- 1 a 5 perguntas por vez
- Dificuldade: 🟢 Fácil / 🟡 Médio / 🔴 Difícil
- Inclui gabarito com explicação de cada resposta

**`/flashcard`**
- De 1 a 8 flashcards por geração
- Navegação com botões (Anterior / Virar / Próximo)
- Sessão ativa por 5 minutos

**`/resumo`**
- Níveis: 🎒 Básico / 📘 Intermediário / 🎓 Avançado
- Estrutura fixa: definição, pontos principais, exemplo prático e erro comum

**`/checklist`**
- Subcomandos: `criar`, `adicionar`, `marcar`, `ver`, `apagar`
- Barra de progresso visual
- Autocomplete nos nomes das checklists

**`/prazo`**
- Subcomandos: `adicionar`, `listar`, `remover`
- Notificações automáticas no canal configurado
- Indicadores de urgência por cor (🟢🟡🟠🔴)

---

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- Conta no [Discord Developer Portal](https://discord.com/developers/applications)
- Chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)

### 1. Clone o repositório

```bash
git clone https://github.com/sapo793/study_bot_discord.git
cd study_bot_discord
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DISCORD_TOKEN=seu_token_do_bot
CLIENT_ID=id_da_aplicacao_discord
GEMINI_API_KEY=sua_chave_gemini

# Opcional: define um servidor específico para registrar os comandos (modo dev)
# Se omitido, os comandos são registrados globalmente (pode levar até 1h)
GUILD_ID=id_do_servidor
```

> **Como obter cada valor:**
> - `DISCORD_TOKEN` e `CLIENT_ID`: [Discord Developer Portal](https://discord.com/developers/applications) → sua aplicação → Bot / General Information
> - `GEMINI_API_KEY`: [Google AI Studio](https://aistudio.google.com/app/apikey)
> - `GUILD_ID`: No Discord, ative o Modo Desenvolvedor (Configurações → Avançado), clique com o botão direito no servidor → Copiar ID

### 4. Registre os slash commands

```bash
npm run register
```

### 5. Inicie o bot

```bash
npm start
```

Para desenvolvimento com reinicialização automática:

```bash
npm run dev
```

---

## 🛠️ Tecnologias

- [Discord.js](https://discord.js.org/) v14
- [Google Generative AI](https://www.npmjs.com/package/@google/generative-ai) (Gemini 2.5 Flash)
- [dotenv](https://www.npmjs.com/package/dotenv)
- Node.js (ESModules)

---

## 📁 Estrutura do projeto

```
study_bot_discord/
├── src/
│   ├── commands/
│   │   ├── ajuda.js
│   │   ├── checklist.js
│   │   ├── estudar.js
│   │   ├── flashcard.js
│   │   ├── prazo.js
│   │   ├── quiz.js
│   │   ├── resumo.js
│   │   └── setup.js
│   ├── gemini.js       # Integração com a API do Gemini
│   ├── index.js        # Entry point do bot
│   ├── scheduler.js    # Agendamento de notificações de prazos
│   └── storage.js      # Persistência de dados (checklists e prazos)
├── register.js         # Script para registrar slash commands
├── package.json
└── .env                # NÃO versionar — adicione ao .gitignore
```

---

## ⚠️ Importante

- Nunca suba o arquivo `.env` para o repositório. Ele já está no `.gitignore`.
- O bot precisa da permissão `application.commands` e do escopo `bot` ao ser adicionado ao servidor.
- Para gerar o link de convite: Discord Developer Portal → sua aplicação → OAuth2 → URL Generator → marque `bot` e `application.commands`.

---

## 📄 Licença

MIT
