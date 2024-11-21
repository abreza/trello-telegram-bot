import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_CONFIG } from '../../../configs/telegram.config';
import { menuStates } from '../config/menu-states.config';
import { CHAT_STATES, MENU_STATES } from '../types/state.types';
import { StateService } from '../../../core/services/state.service';

export async function handleCallbackQuery(bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery): Promise<void> {
	const chatId = callbackQuery.message?.chat.id;
	const messageId = callbackQuery.message?.message_id;

	if (!chatId || !messageId || !callbackQuery.data) return;

	const newMenuState = callbackQuery.data as MENU_STATES;
	const stateService = StateService.getInstance();

	try {
		await bot.answerCallbackQuery(callbackQuery.id, {});
		switch (newMenuState) {
			case MENU_STATES.SIGNUP:
				stateService.updateUserState(chatId, {
					state: CHAT_STATES.SIGNUP_AWAITING_USERNAME,
				});

				await bot.editMessageText(TELEGRAM_CONFIG.MESSAGES.AWAITING_USERNAME, {
					chat_id: chatId,
					message_id: messageId,
				});
				break;

			case MENU_STATES.START:
				stateService.clearUserState(chatId);

			default:
				await bot.editMessageText(menuStates[newMenuState].showingMessage, {
					chat_id: chatId,
					message_id: messageId,
					reply_markup: {
						inline_keyboard: menuStates[newMenuState].keyboard || [],
					},
				});
		}
	} catch (error) {
		console.error('Error handling callback query:', error);
		await bot.answerCallbackQuery(callbackQuery.id, {
			text: 'ERROR',
			show_alert: true,
		});
	}
}
