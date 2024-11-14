import { Env } from '../types/env';
import { ApiResponse } from '../types/api';
import { AIService } from '../services/ai';
import { createJsonResponse } from '../utils/response';
import TelegramBot from 'node-telegram-bot-api';

export async function handleWebhook(request: Request, env: Env): Promise<Response> {
	try {
		const update: TelegramBot.Update = await request.json();
		const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });

		if (update.message?.text) {
			const chatId = update.message.chat.id;
			const messageText = update.message.text;

			if (messageText.startsWith('/')) {
				await handleCommand(bot, update.message);
				return new Response('OK');
			}

			const aiService = AIService.getInstance();
			const aiResponse = await aiService.generateResponse(messageText);

			await bot.sendMessage(chatId, aiResponse);
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

async function handleCommand(bot: TelegramBot, message: TelegramBot.Message): Promise<void> {
	const chatId = message.chat.id;
	const command = message.text?.split(' ')[0].toLowerCase();

	switch (command) {
		case '/start':
			await bot.sendMessage(chatId, 'Welcome! I am your AI assistant. How can I help you today?', {
				reply_markup: {
					inline_keyboard: [[{ text: 'Help', callback_data: 'help' }], [{ text: 'About', callback_data: 'about' }]],
				},
			});
			break;

		case '/help':
			await bot.sendMessage(
				chatId,
				'Here are the available commands:\n' +
					'/start - Start the bot\n' +
					'/help - Show this help message\n' +
					'/about - About this bot\n' +
					"You can also just send me a message and I'll respond!"
			);
			break;

		case '/about':
			await bot.sendMessage(chatId, 'I am an AI assistant powered by Groq. I can help you with various tasks and answer your questions.');
			break;

		default:
			await bot.sendMessage(chatId, "Sorry, I don't recognize that command. Send /help to see available commands.");
			break;
	}
}

async function handleCallbackQuery(bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery): Promise<void> {
	const chatId = callbackQuery.message?.chat.id;
	if (!chatId || !callbackQuery.data) return;

	try {
		switch (callbackQuery.data) {
			case 'help':
				// First answer the callback query to stop loading state
				await bot.answerCallbackQuery(callbackQuery.id, {
					text: 'Showing help information',
				});

				// Then send the detailed help message
				await bot.sendMessage(
					chatId,
					'Here are the available commands:\n\n' +
						'🚀 /start - Start the bot\n' +
						'❓ /help - Show this help message\n' +
						'ℹ️ /about - About this bot\n\n' +
						"You can also just send me a message and I'll respond!",
					{
						parse_mode: 'HTML',
						reply_markup: {
							inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'start' }]],
						},
					}
				);
				break;

			case 'about':
				await bot.answerCallbackQuery(callbackQuery.id, {
					text: 'Showing about information',
				});

				await bot.sendMessage(
					chatId,
					'I am an AI assistant powered by Groq. I can help you with various tasks and answer your questions.',
					{
						parse_mode: 'HTML',
						reply_markup: {
							inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'start' }]],
						},
					}
				);
				break;

			case 'start':
				await bot.answerCallbackQuery(callbackQuery.id, {
					text: 'Returning to main menu',
				});

				await bot.sendMessage(chatId, 'Welcome to the main menu! How can I help you today?', {
					reply_markup: {
						inline_keyboard: [[{ text: '❓ Help', callback_data: 'help' }], [{ text: 'ℹ️ About', callback_data: 'about' }]],
					},
				});
				break;

			default:
				await bot.answerCallbackQuery(callbackQuery.id, {
					text: 'Unknown action',
					show_alert: true,
				});
				break;
		}
	} catch (error) {
		console.error('Error handling callback query:', error);
		await bot.answerCallbackQuery(callbackQuery.id, {
			text: 'An error occurred while processing your request',
			show_alert: true,
		});
	}
}
