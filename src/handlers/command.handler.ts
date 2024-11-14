import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_COMMANDS } from '../config/constants';

export async function handleCommand(bot: TelegramBot, message: TelegramBot.Message): Promise<void> {
	const chatId = message.chat.id;
	const command = message.text?.split(' ')[0].toLowerCase();

	switch (command) {
		case TELEGRAM_COMMANDS.START:
			await bot.sendMessage(chatId, 'Welcome! I am your AI assistant. How can I help you today?', {
				reply_markup: {
					inline_keyboard: [[{ text: 'Help', callback_data: 'help' }], [{ text: 'About', callback_data: 'about' }]],
				},
			});
			break;

		case TELEGRAM_COMMANDS.HELP:
			await bot.sendMessage(
				chatId,
				`Here are the available commands:
${TELEGRAM_COMMANDS.START} - Start the bot
${TELEGRAM_COMMANDS.HELP} - Show this help message
${TELEGRAM_COMMANDS.ABOUT} - About this bot
You can also just send me a message and I'll respond!`
			);
			break;

		case TELEGRAM_COMMANDS.ABOUT:
			await bot.sendMessage(chatId, 'I am an AI assistant powered by Groq. I can help you with various tasks and answer your questions.');
			break;

		default:
			await bot.sendMessage(chatId, `Sorry, I don't recognize that command. Send ${TELEGRAM_COMMANDS.HELP} to see available commands.`);
			break;
	}
}
