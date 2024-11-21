export interface User {
	id: string;
	username: string;
	passwordHash: string;
	createdAt: string;
	lastLoginAt?: string;
}

export interface SignupRequest {
	username: string;
	password: string;
}
