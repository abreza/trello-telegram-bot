import { Env } from '../types/env';
import { ApiResponse } from '../types/api';
import { TelegramService } from '../services/telegram';
import { createJsonResponse } from '../utils/response';

export async function handleRegister(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const webhookUrl = `${url.protocol}//${url.hostname}/webhook`;
		const telegramService = new TelegramService(env.TELEGRAM_BOT_TOKEN);

		// Delete existing webhook
		await telegramService.deleteWebhook();

		// Set new webhook
		const result = await telegramService.setWebhook(webhookUrl);
		if (!result.ok) {
			throw new Error(result.description || 'Failed to register webhook');
		}

		// Get webhook info
		const infoResult = await telegramService.getWebhookInfo();

		return createJsonResponse<ApiResponse>({
			success: true,
			message: `Webhook registered successfully at ${webhookUrl}`,
			...infoResult,
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
