import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('❌ GEMINI_API_KEY não encontrada no .env');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
  },
  systemInstruction: `Você é um assistente de estudos inteligente, paciente e motivador chamado StudyBot.
Responda sempre em português brasileiro, de forma clara e didática.
Seja completo e detalhado nas respostas. Explique os conceitos com profundidade e exemplos práticos.
Use analogias para facilitar o entendimento sempre que possível.
Ao criar quizzes, formate as alternativas assim: A) B) C) D), uma por linha.
Sempre que possível, use emojis para tornar a resposta mais visual e agradável.
Se o aluno errar, seja encorajador e explique o conceito com paciência.`,
});

// Mapa de sessões por usuário (mantém histórico de conversa)
const sessions = new Map();

// Tempo máximo de sessão: 2 horas (em ms)
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
const sessionTimers = new Map();

/**
 * Envia mensagem para o Gemini mantendo histórico de contexto por usuário.
 * @param {string} userId - ID do usuário no Discord
 * @param {string} mensagem - Mensagem do usuário
 * @returns {Promise<string>} - Resposta da IA
 */
export async function perguntarIA(userId, mensagem) {
  // Inicia nova sessão se não existir
  if (!sessions.has(userId)) {
    sessions.set(userId, model.startChat({ history: [] }));
  }

  // Renova o timer de expiração da sessão
  if (sessionTimers.has(userId)) clearTimeout(sessionTimers.get(userId));
  sessionTimers.set(userId, setTimeout(() => {
    sessions.delete(userId);
    sessionTimers.delete(userId);
  }, SESSION_TIMEOUT));

  const chat = sessions.get(userId);

  try {
    const result = await chat.sendMessage(mensagem);
    return result.response.text();
  } catch (error) {
    console.error('[Gemini] Erro em perguntarIA:', error.message);
    if (error.message?.includes('SAFETY')) {
      return '⚠️ Minha resposta foi bloqueada por filtros de segurança. Tente reformular sua pergunta.';
    }
    return '⚠️ Não consegui processar sua pergunta agora. Tente novamente em alguns instantes.';
  }
}

/**
 * Gera conteúdo sem histórico (para quiz, resumo, flashcards, etc.)
 * @param {string} prompt - Prompt completo para a IA
 * @returns {Promise<string>} - Resposta da IA
 */
export async function gerarSemHistorico(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('[Gemini] Erro em gerarSemHistorico:', error.message);
    return '⚠️ Erro ao gerar conteúdo. Tente novamente.';
  }
}

/**
 * Limpa o histórico de conversa de um usuário.
 * @param {string} userId - ID do usuário
 */
export function limparSessao(userId) {
  sessions.delete(userId);
  if (sessionTimers.has(userId)) {
    clearTimeout(sessionTimers.get(userId));
    sessionTimers.delete(userId);
  }
}

/**
 * Retorna o número de sessões ativas.
 */
export function totalSessoesAtivas() {
  return sessions.size;
}
