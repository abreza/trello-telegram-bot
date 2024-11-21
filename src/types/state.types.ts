export enum MENU_STATES {
	START = 'start',
	HELP = 'help',
	ABOUT = 'about',
	ERROR = 'error',
	SIGNUP = 'signup',
}

export enum CHAT_STATES {
	IDEAL = 'ideal',
	SIGNUP_AWAITING_USERNAME = 'signup_awaiting_username',
	SIGNUP_AWAITING_PASSWORD = 'signup_awaiting_password',
	LOGIN_AWAITING_USERNAME = 'login_awaiting_username',
	LOGIN_AWAITING_PASSWORD = 'login_awaiting_password',
}

export interface UserState {
	chatId: number;
	state: CHAT_STATES;
	signupData?: {
		username?: string;
		tempPassword?: string;
	};
}
