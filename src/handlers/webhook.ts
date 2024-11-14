import { Env } from '../types/env';
import { ApiResponse } from '../types/api';
import { TelegramUpdate } from '../types/telegram';
import { TelegramService } from '../services/telegram';
import { AIService } from '../services/ai';
import { createJsonResponse } from '../utils/response';

export async function handleWebhook(request: Request, env: Env): Promise<Response> {
	try {
		const update: TelegramUpdate = await request.json();

		const telegramService = new TelegramService(env.TELEGRAM_BOT_TOKEN);

		if (!update.message?.text) {
			return new Response('OK');
		}

		const chatId = update.message.chat.id;
		const messageText = update.message.text;

		const aiService = AIService.getInstance();
		const aiResponse = await aiService.generateResponse(messageText);

		await telegramService.sendMessage(chatId, aiResponse);

		return new Response('OK');
	} catch (error) {
		console.error('Webhook error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return createJsonResponse<ApiResponse>(
			{
				success: false,
				error: errorMessage,
			},
			500
		);
	}
}
