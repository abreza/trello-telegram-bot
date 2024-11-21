import TelegramBot from 'node-telegram-bot-api';
import { COMMAND_TO_MENU, COMMAND_TO_MESSAGE, TELEGRAM_CONFIG } from '../config/telegram.config';
import { menuStates } from '../config/menu-states.config';
import { MENU_STATES } from '../types/state.types';

export async function handleCommand(bot: TelegramBot, message: TelegramBot.Message): Promise<void> {
	const chatId = message.chat.id;
	const command = message.text?.split(' ')[0].toLowerCase() as any;

	const menuKey = COMMAND_TO_MENU[command] as MENU_STATES;
	const messageKey = COMMAND_TO_MESSAGE[command] as keyof typeof TELEGRAM_CONFIG.MESSAGES;

	await bot.sendMessage(chatId, TELEGRAM_CONFIG.MESSAGES[messageKey], {
		reply_markup: {
			inline_keyboard: (menuKey && menuStates[menuKey]?.keyboard) || [],
		},
	});
}
