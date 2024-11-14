import TelegramBot from 'node-telegram-bot-api';

export async function handleCallbackQuery(bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery): Promise<void> {
	const chatId = callbackQuery.message?.chat.id;
	const messageId = callbackQuery.message?.message_id;

	if (!chatId || !messageId || !callbackQuery.data) return;

	try {
		switch (callbackQuery.data) {
			case 'help':
				await bot.answerCallbackQuery(callbackQuery.id, {
					text: 'Showing help information',
				});
				await bot.editMessageText(
					'Here are the available commands:\n\n' +
						'🚀 /start - Start the bot\n' +
						'❓ /help - Show this help message\n' +
						'ℹ️ /about - About this bot\n\n' +
						"You can also just send me a message and I'll respond!",
					{
						chat_id: chatId,
						message_id: messageId,
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
				await bot.editMessageText('I am an AI assistant powered by Groq. I can help you with various tasks and answer your questions.', {
					chat_id: chatId,
					message_id: messageId,
					parse_mode: 'HTML',
					reply_markup: {
						inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'start' }]],
					},
				});
				break;

			case 'start':
				await bot.answerCallbackQuery(callbackQuery.id, {
					text: 'Returning to main menu',
				});
				await bot.editMessageText('Welcome to the main menu! How can I help you today?', {
					chat_id: chatId,
					message_id: messageId,
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
