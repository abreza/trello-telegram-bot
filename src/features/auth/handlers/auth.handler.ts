import TelegramBot from 'node-telegram-bot-api';
import { UserService } from '../../../core/services/user.service';
import { StateService } from '../../../core/services/state.service';
import { TELEGRAM_CONFIG } from '../../../configs/telegram.config';
import { CHAT_STATES } from '../../state/types/state.types';

export async function handleSignupMessage(bot: TelegramBot, message: TelegramBot.Message): Promise<void> {
	const chatId = message.chat.id;
	const userService = UserService.getInstance();
	const stateService = StateService.getInstance();
	const userState = stateService.getUserState(chatId);
	const messageText = message.text || '';

	try {
		switch (userState.state) {
			case CHAT_STATES.SIGNUP_AWAITING_USERNAME:
				if (messageText.length < 3) {
					await bot.sendMessage(chatId, 'Username must be at least 3 characters long. Please try again:');
					return;
				}

				stateService.updateUserState(chatId, {
					state: CHAT_STATES.SIGNUP_AWAITING_PASSWORD,
					signupData: { username: messageText },
				});

				await bot.sendMessage(chatId, TELEGRAM_CONFIG.MESSAGES.AWAITING_PASSWORD);
				break;

			case CHAT_STATES.SIGNUP_AWAITING_PASSWORD:
				if (messageText.length < 6) {
					await bot.sendMessage(chatId, 'Password must be at least 6 characters long. Please try again:');
					return;
				}

				try {
					const username = userState.signupData?.username;
					if (!username) {
						throw new Error('Username not found in state');
					}

					await userService.createUser(username, messageText);

					stateService.clearUserState(chatId);

					await bot.sendMessage(chatId, 'Registration successful! You can now use the bot.', {
						reply_markup: {
							inline_keyboard: [[TELEGRAM_CONFIG.BUTTONS.BACK]],
						},
					});
				} catch (error) {
					if (error instanceof Error && error.message === 'Username already exists') {
						stateService.clearUserState(chatId);
						await bot.sendMessage(chatId, 'This username is already taken. Please try again with a different username.', {
							reply_markup: {
								inline_keyboard: [[TELEGRAM_CONFIG.BUTTONS.SIGNUP]],
							},
						});
					} else {
						throw error;
					}
				}
				break;

			default:
				await bot.sendMessage(chatId, TELEGRAM_CONFIG.MESSAGES.ERROR);
				break;
		}
	} catch (error) {
		console.error('Error in signup process:', error);
		stateService.clearUserState(chatId);
		await bot.sendMessage(chatId, TELEGRAM_CONFIG.MESSAGES.ERROR, {
			reply_markup: {
				inline_keyboard: [[TELEGRAM_CONFIG.BUTTONS.BACK]],
			},
		});
	}
}
