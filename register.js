import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('❌ DISCORD_TOKEN e CLIENT_ID são obrigatórios no .env');
  process.exit(1);
}

const commands = [];
const commandsPath = join(__dirname, 'src', 'commands');

for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const filePath = pathToFileURL(join(commandsPath, file)).href;
  const { default: cmd } = await import(filePath);
  if (cmd?.data) {
    commands.push(cmd.data.toJSON());
    console.log(`📦 Preparando: /${cmd.data.name}`);
  }
}

const rest = new REST().setToken(DISCORD_TOKEN);

try {
  if (GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log(`\n✅ ${commands.length} comando(s) registrado(s) no servidor ${GUILD_ID} (modo dev)`);
  } else {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log(`\n✅ ${commands.length} comando(s) registrado(s) globalmente`);
    console.log('⏳ Pode levar até 1 hora para aparecer em todos os servidores.');
  }
} catch (error) {
  console.error('❌ Erro ao registrar comandos:', error);
}
