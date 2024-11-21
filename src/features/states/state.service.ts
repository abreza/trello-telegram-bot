import { CHAT_STATES, UserState } from './types/state.types';

export class StateService {
	private static instance: StateService;
	private userStates: Map<number, UserState>;

	private constructor() {
		this.userStates = new Map();
	}

	public static getInstance(): StateService {
		if (!StateService.instance) {
			StateService.instance = new StateService();
		}
		return StateService.instance;
	}

	public getUserState(chatId: number): UserState {
		let state = this.userStates.get(chatId);
		if (!state) {
			state = { chatId, state: CHAT_STATES.IDEAL };
			this.userStates.set(chatId, state);
		}
		return state;
	}

	public updateUserState(chatId: number, updates: Partial<UserState>): void {
		const currentState = this.getUserState(chatId);
		this.userStates.set(chatId, { ...currentState, ...updates });
	}

	public clearUserState(chatId: number): void {
		this.userStates.set(chatId, { chatId, state: CHAT_STATES.IDEAL });
	}
}
