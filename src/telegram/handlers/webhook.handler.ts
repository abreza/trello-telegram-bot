import { Env } from '../../core/types/env.types';
import { ApiResponse } from '../../core/types/api.types';
import { createJsonResponse } from '../../utils/response.utils';
import { handleCommand } from '../../states/handlers/command.handler';
import { handleCallbackQuery } from '../../states/handlers/callback.handler';
import { TelegramBot } from '../libs/node-telegram-bot-api';
import { handleMessage } from '../../states/handlers/message.handler';

export async function handleWebhook(request: Request, env: Env): Promise<Response> {
	try {
		const update: TelegramBot.Update = await request.json();
		const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });

		if (update.message?.text) {
			const messageText = update.message.text;
			await (messageText.startsWith('/') ? handleCommand : handleMessage)(bot, update.message);
		} else if (update.callback_query) {
			await handleCallbackQuery(bot, update.callback_query);
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
