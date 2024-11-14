export interface TelegramResponse {
	ok: boolean;
	result?: any;
	description?: string;
}

export interface TelegramUser {
	id: number;
	is_bot: boolean;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code?: string;
}

export interface TelegramChat {
	id: number;
	type: string;
	username?: string;
	first_name?: string;
	last_name?: string;
}

export interface TelegramMessage {
	message_id: number;
	from?: TelegramUser;
	chat: TelegramChat;
	date: number;
	text?: string;
	reply_markup?: InlineKeyboardMarkup;
}

export interface CallbackQuery {
	id: string;
	from: TelegramUser;
	message?: TelegramMessage;
	inline_message_id?: string;
	chat_instance?: string;
	data?: string;
}

export interface TelegramUpdate {
	update_id: number;
	message?: TelegramMessage;
	callback_query?: CallbackQuery;
}

export interface InlineKeyboardMarkup {
	inline_keyboard: InlineKeyboardButton[][];
	resize_keyboard: boolean;
}

export interface InlineKeyboardButton {
	text: string;
	callback_data?: string;
	url?: string;
}

export interface SendMessageParams {
	chat_id: number;
	text: string;
	reply_markup?: InlineKeyboardMarkup;
}

export interface PhotoMessage extends TelegramMessage {
	photo: PhotoSize[];
	caption?: string;
}

export interface PhotoSize {
	file_id: string;
	width: number;
	height: number;
	file_size?: number;
}

export interface DocumentMessage extends TelegramMessage {
	document: Document;
	caption?: string;
}

export interface Document {
	file_id: string;
	file_name?: string;
	mime_type?: string;
	file_size?: number;
}

export interface BotCommand {
	command: string;
	description: string;
}

export interface MessageEntity {
	type: string;
	offset: number;
	length: number;
	url?: string;
	user?: TelegramUser;
}
