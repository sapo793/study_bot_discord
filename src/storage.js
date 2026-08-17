import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

function readFile(filename) {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

function writeFile(filename, data) {
  writeFileSync(join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

// ── Checklists ──────────────────────────────────────────────────────────────

export function getChecklists(guildId, userId) {
  const data = readFile('checklists.json');
  return data[guildId]?.[userId] ?? {};
}

export function saveChecklist(guildId, userId, name, items) {
  const data = readFile('checklists.json');
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = {};
  data[guildId][userId][name] = items;
  writeFile('checklists.json', data);
}

export function deleteChecklist(guildId, userId, name) {
  const data = readFile('checklists.json');
  delete data[guildId]?.[userId]?.[name];
  writeFile('checklists.json', data);
}

// ── Prazos ──────────────────────────────────────────────────────────────────

export function getPrazos(guildId) {
  const data = readFile('prazos.json');
  return data[guildId] ?? [];
}

export function addPrazo(guildId, prazo) {
  const data = readFile('prazos.json');
  if (!data[guildId]) data[guildId] = [];
  const id = Date.now().toString(36);
  data[guildId].push({ id, ...prazo });
  writeFile('prazos.json', data);
  return id;
}

export function removePrazo(guildId, id) {
  const data = readFile('prazos.json');
  if (!data[guildId]) return false;
  const before = data[guildId].length;
  data[guildId] = data[guildId].filter(p => p.id !== id);
  writeFile('prazos.json', data);
  return data[guildId].length < before;
}

export function getAllPrazos() {
  return readFile('prazos.json');
}

export function markNotified(guildId, id, level) {
  const data = readFile('prazos.json');
  const prazo = data[guildId]?.find(p => p.id === id);
  if (!prazo) return;
  if (!prazo.notified) prazo.notified = [];
  if (!prazo.notified.includes(level)) prazo.notified.push(level);
  writeFile('prazos.json', data);
}
