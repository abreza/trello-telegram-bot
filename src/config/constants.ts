export const TELEGRAM_COMMANDS = {
	START: '/start',
	HELP: '/help',
	ABOUT: '/about',
} as const;

export const AI_CONFIG = {
	MODEL: 'llama-3.1-70b-versatile',
	TEMPERATURE: 0.7,
	MAX_TOKENS: 1000,
} as const;
