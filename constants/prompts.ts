import { Prompt } from '@/shared/app-types';

export const GUIDED_PROMPTS: Prompt[] = [
  // Childhood
  { id: 'c1', theme: 'childhood', text: 'What was your childhood home like? Describe a room you remember most.' },
  { id: 'c2', theme: 'childhood', text: 'What games did you play as a child? Who did you play with?' },
  { id: 'c3', theme: 'childhood', text: 'What was your favorite meal growing up? Who cooked it?' },
  { id: 'c4', theme: 'childhood', text: 'Tell me about your best friend from childhood.' },
  { id: 'c5', theme: 'childhood', text: 'What was school like for you? What was your favorite subject?' },
  { id: 'c6', theme: 'childhood', text: 'What did you want to be when you grew up?' },
  { id: 'c7', theme: 'childhood', text: 'What is your earliest memory?' },
  { id: 'c8', theme: 'childhood', text: 'What holidays or traditions did your family celebrate?' },

  // Recipes & Food
  { id: 'r1', theme: 'recipes', text: 'What is a recipe you know by heart? Walk me through how to make it.' },
  { id: 'r2', theme: 'recipes', text: 'What dish reminds you most of your mother or grandmother?' },
  { id: 'r3', theme: 'recipes', text: 'What was the best meal you ever cooked? What was the occasion?' },
  { id: 'r4', theme: 'recipes', text: 'Is there a secret ingredient or trick you use in your cooking?' },
  { id: 'r5', theme: 'recipes', text: 'What food do you associate with celebrations in your family?' },
  { id: 'r6', theme: 'recipes', text: 'Describe a meal that brings back a strong memory.' },

  // Love & Marriage
  { id: 'l1', theme: 'love', text: 'How did you meet your spouse or partner? Tell me the whole story.' },
  { id: 'l2', theme: 'love', text: 'What was your first date like?' },
  { id: 'l3', theme: 'love', text: 'What is the secret to a long and happy marriage?' },
  { id: 'l4', theme: 'love', text: 'What is your favorite memory with your spouse?' },
  { id: 'l5', theme: 'love', text: 'What advice would you give about love and relationships?' },
  { id: 'l6', theme: 'love', text: 'Tell me about the moment you knew this was the right person.' },

  // Work & Career
  { id: 'w1', theme: 'work', text: 'What was your first job? What did you learn from it?' },
  { id: 'w2', theme: 'work', text: 'What was the most meaningful work you ever did?' },
  { id: 'w3', theme: 'work', text: 'Tell me about a challenge at work that you overcame.' },
  { id: 'w4', theme: 'work', text: 'Who was the most influential person in your career?' },
  { id: 'w5', theme: 'work', text: 'What are you most proud of professionally?' },
  { id: 'w6', theme: 'work', text: 'What would you tell a young person just starting their career?' },

  // Life Advice
  { id: 'a1', theme: 'advice', text: 'What is the best advice you ever received?' },
  { id: 'a2', theme: 'advice', text: 'What do you know now that you wish you had known at 20?' },
  { id: 'a3', theme: 'advice', text: 'What is the most important lesson life has taught you?' },
  { id: 'a4', theme: 'advice', text: 'What would you tell your grandchildren about how to live a good life?' },
  { id: 'a5', theme: 'advice', text: 'What are you most grateful for in your life?' },
  { id: 'a6', theme: 'advice', text: 'What does happiness mean to you?' },

  // Faith & Values
  { id: 'f1', theme: 'faith', text: 'What values were most important in your family growing up?' },
  { id: 'f2', theme: 'faith', text: 'Has faith or spirituality played a role in your life? Tell me about it.' },
  { id: 'f3', theme: 'faith', text: 'What do you believe in most deeply?' },
  { id: 'f4', theme: 'faith', text: 'Tell me about a time when your faith or values were tested.' },
  { id: 'f5', theme: 'faith', text: 'What traditions or rituals have been meaningful to your family?' },
];

export const THEME_META: Record<string, { label: string; emoji: string; color: string }> = {
  childhood: { label: 'Childhood', emoji: '🏡', color: '#7B9E87' },
  recipes:   { label: 'Recipes & Food', emoji: '🍳', color: '#C4956A' },
  love:      { label: 'Love & Marriage', emoji: '💕', color: '#C27B8E' },
  work:      { label: 'Work & Career', emoji: '💼', color: '#7B8EA8' },
  advice:    { label: 'Life Advice', emoji: '🌟', color: '#B8A84A' },
  faith:     { label: 'Faith & Values', emoji: '✨', color: '#9B7BB8' },
};

export function getPromptsByTheme(theme: string): Prompt[] {
  return GUIDED_PROMPTS.filter(p => p.theme === theme);
}

export function getDailyPrompt(index: number): Prompt {
  return GUIDED_PROMPTS[index % GUIDED_PROMPTS.length];
}
