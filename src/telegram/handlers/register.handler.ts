import { Env } from '../../core/types/env.types';
import { ApiResponse } from '../../core/types/api.types';
import { createJsonResponse } from '../../utils/response.utils';
import { TelegramBot } from '../libs/node-telegram-bot-api';

export async function handleRegister(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const webhookUrl = `${url.protocol}//${url.hostname}/webhook`;
		const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });

		await bot.deleteWebHook();
		await bot.setWebHook(webhookUrl);
		const webhookInfo = await bot.getWebHookInfo();

		return createJsonResponse<ApiResponse>({
			success: true,
			message: `Webhook registered successfully at ${webhookUrl}`,
			webhookInfo,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return createJsonResponse<ApiResponse>(
			{
				success: false,
				error: errorMessage,
			},
			400
		);
	}
}
