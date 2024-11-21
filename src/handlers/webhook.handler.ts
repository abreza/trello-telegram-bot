import { Env } from '../types/env.types';
import { ApiResponse } from '../types/api.types';
import { AIService } from '../services/ai.service';
import { createJsonResponse } from '../utils/response.utils';
import { handleCommand } from './command.handler';
import { handleCallbackQuery } from './callback.handler';
import { TelegramBot } from '../lib/node-telegram-bot-api';

export async function handleWebhook(request: Request, env: Env): Promise<Response> {
	try {
		const update: TelegramBot.Update = await request.json();
		const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });

		if (update.message?.text) {
			const messageText = update.message.text;

			if (messageText.startsWith('/')) {
				await handleCommand(bot, update.message);
				return new Response('OK');
			}

			const aiService = AIService.getInstance();
			const aiResponse = await aiService.generateResponse(messageText);
			await bot.sendMessage(update.message.chat.id, aiResponse);
			return new Response('OK');
		}

		if (update.callback_query) {
			await handleCallbackQuery(bot, update.callback_query);
			return new Response('OK');
		}

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
