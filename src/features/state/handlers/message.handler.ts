import TelegramBot from 'node-telegram-bot-api';
import { AIService } from '../../../core/services/ai.service';
import { StateService } from '../../../core/services/state.service';
import { CHAT_STATES } from '../types/state.types';
import { handleSignupMessage } from '../../auth/handlers/auth.handler';

export async function handleMessage(bot: TelegramBot, message: TelegramBot.Message): Promise<void> {
	const chatId = message.chat.id;
	const stateService = StateService.getInstance();
	const userStates = stateService.getUserState(chatId);

	switch (userStates.state) {
		case CHAT_STATES.SIGNUP_AWAITING_USERNAME:
		case CHAT_STATES.SIGNUP_AWAITING_PASSWORD:
			return handleSignupMessage(bot, message);

		default:
			const aiService = AIService.getInstance();
			const aiResponse = await aiService.generateResponse(message.text!);
			await bot.sendMessage(message.chat.id, aiResponse);
	}
}
