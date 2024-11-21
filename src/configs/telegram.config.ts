import { MENU_STATES } from '../features/state/types/state.types';

export const TELEGRAM_CONFIG = {
	COMMANDS: {
		START: '/start',
		HELP: '/help',
		ABOUT: '/about',
	},
	MESSAGES: {
		WELCOME: 'Welcome! I am your AI assistant. How can I help you today?',
		HELP:
			'Here are the available commands:\n\n' +
			'🚀 /start - Start the bot\n' +
			'❓ /help - Show this help message\n' +
			'ℹ️ /about - About this bot\n\n' +
			"You can also just send me a message and I'll respond!",
		ABOUT: 'I am an AI assistant powered by Groq. I can help you with various tasks and answer your questions.',
		ERROR: "Sorry, I don't recognize that command. Send /help to see available commands.",
		SIGNUP: 'Starting your registration...',
		AWAITING_USERNAME: 'Please enter your desired username:',
		AWAITING_PASSWORD: 'Great! Now please enter your password:',
		PROCESSING: 'Processing your registration...',
	},
	BUTTONS: {
		HELP: { text: '❓ Help', callback_data: 'help' },
		ABOUT: { text: 'ℹ️ About', callback_data: 'about' },
		SIGNUP: { text: '📝 Sign Up', callback_data: 'signup' },
		BACK: { text: '🔙 Back to Menu', callback_data: 'start' },
	},
} as const;

export const COMMAND_TO_MENU: Record<string, MENU_STATES> = {
	[TELEGRAM_CONFIG.COMMANDS.START]: MENU_STATES.START,
	[TELEGRAM_CONFIG.COMMANDS.HELP]: MENU_STATES.HELP,
	[TELEGRAM_CONFIG.COMMANDS.ABOUT]: MENU_STATES.ABOUT,
} as const;

export const COMMAND_TO_MESSAGE: Record<string, keyof typeof TELEGRAM_CONFIG.MESSAGES> = {
	[TELEGRAM_CONFIG.COMMANDS.START]: 'WELCOME',
	[TELEGRAM_CONFIG.COMMANDS.HELP]: 'HELP',
	[TELEGRAM_CONFIG.COMMANDS.ABOUT]: 'ABOUT',
} as const;
