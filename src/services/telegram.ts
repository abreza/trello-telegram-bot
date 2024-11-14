import { TelegramResponse, SendMessageParams, InlineKeyboardMarkup } from '../types/telegram';

export class TelegramService {
	constructor(private readonly token: string) {}

	private getApiUrl(method: string): string {
		return `https://api.telegram.org/bot${this.token}/${method}`;
	}

	async deleteWebhook(): Promise<TelegramResponse> {
		const response = await fetch(this.getApiUrl('deleteWebhook'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.json();
	}

	async setWebhook(url: string): Promise<TelegramResponse> {
		const response = await fetch(this.getApiUrl('setWebhook'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				url,
				allowed_updates: ['message', 'edited_channel_post', 'callback_query', 'message_reaction', 'message_reaction_count', 'chat_member'],
			}),
		});
		return response.json();
	}

	async getWebhookInfo(): Promise<TelegramResponse> {
		const response = await fetch(this.getApiUrl('getWebhookInfo'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.json();
	}

	async sendMessage(chatId: number, text: string): Promise<TelegramResponse> {
		const messageData: SendMessageParams = {
			chat_id: chatId,
			text,
		};

		const response = await fetch(this.getApiUrl('sendMessage'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(messageData),
		});
		return response.json();
	}

	async answerCallbackQuery(callbackQueryId: string, text?: string): Promise<TelegramResponse> {
		const response = await fetch(this.getApiUrl('answerCallbackQuery'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				callback_query_id: callbackQueryId,
				text,
			}),
		});
		return response.json();
	}
}
