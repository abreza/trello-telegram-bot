import { InlineKeyboardButton } from 'node-telegram-bot-api';
import { TELEGRAM_CONFIG } from '../../../configs/telegram.config';
import { MENU_STATES } from '../types/state.types';

export interface StateConfig {
	readonly showingMessage: string;
	keyboard?: InlineKeyboardButton[][];
}

export const menuStates: Record<MENU_STATES, StateConfig> = {
	[MENU_STATES.START]: {
		showingMessage: TELEGRAM_CONFIG.MESSAGES.WELCOME,
		keyboard: [[TELEGRAM_CONFIG.BUTTONS.HELP, TELEGRAM_CONFIG.BUTTONS.ABOUT], [TELEGRAM_CONFIG.BUTTONS.SIGNUP]],
	},
	[MENU_STATES.HELP]: {
		showingMessage: TELEGRAM_CONFIG.MESSAGES.HELP,
		keyboard: [[TELEGRAM_CONFIG.BUTTONS.BACK]],
	},
	[MENU_STATES.ABOUT]: {
		showingMessage: TELEGRAM_CONFIG.MESSAGES.ABOUT,
		keyboard: [[TELEGRAM_CONFIG.BUTTONS.BACK]],
	},
	[MENU_STATES.ERROR]: {
		showingMessage: TELEGRAM_CONFIG.MESSAGES.ERROR,
	},
	[MENU_STATES.SIGNUP]: {
		showingMessage: TELEGRAM_CONFIG.MESSAGES.SIGNUP,
	},
} as const;
