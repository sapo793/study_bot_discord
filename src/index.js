import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { startScheduler } from './scheduler.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.commands = new Collection();

// Carrega os comandos automaticamente
const commandsPath = join(__dirname, 'commands');
for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const { default: command } = await import(pathToFileURL(join(commandsPath, file)).href);
  if (command?.data && command?.execute) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Comando carregado: /${command.data.name}`);
  }
}

client.once('ready', () => {
  console.log(`\n🤖 Bot online como ${client.user.tag}`);
  console.log(`📚 Comandos disponíveis: ${[...client.commands.keys()].map(c => `/${c}`).join(', ')}\n`);
  client.user.setActivity('estudando com IA 📚', { type: 3 });
  startScheduler(client);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (command?.autocomplete) {
      try { await command.autocomplete(interaction); } catch { /* silencia */ }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Erro no comando /${interaction.commandName}:`, error);
    const msg = { content: '❌ Ocorreu um erro ao executar esse comando. Tente novamente.', ephemeral: true };
    interaction.replied || interaction.deferred
      ? interaction.followUp(msg)
      : interaction.reply(msg);
  }
});

client.login(process.env.DISCORD_TOKEN);
