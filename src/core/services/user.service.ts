import { hashPassword, verifyPassword } from '../utils/auth.utils';

export interface User {
	id: number;
	username: string;
	password_hash: string;
	created_at: string;
	last_login?: string;
}

export class UserService {
	private static instance: UserService;
	private db: D1Database;

	private constructor(db: D1Database) {
		this.db = db;
	}

	static initialize(db: D1Database): void {
		if (!UserService.instance) {
			UserService.instance = new UserService(db);
		}
	}

	static getInstance(): UserService {
		if (!UserService.instance) {
			throw new Error('UserService must be initialized with database first');
		}
		return UserService.instance;
	}

	async createTables(): Promise<void> {
		await this.db
			.prepare(
				`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME
            )
        `
			)
			.run();
	}

	async createUser(username: string, password: string): Promise<User> {
		const existingUser = await this.findUserByUsername(username);
		if (existingUser) {
			throw new Error('Username already exists');
		}

		const passwordHash = await hashPassword(password);
		const stmt = this.db.prepare(`
            INSERT INTO users (username, password_hash)
            VALUES (?, ?)
            RETURNING *
        `);

		const result = await stmt.bind(username, passwordHash).first<User>();
		if (!result) {
			throw new Error('Failed to create user');
		}

		return result;
	}

	async findUserByUsername(username: string): Promise<User | null> {
		const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
		return await stmt.bind(username).first<User>();
	}

	async verifyCredentials(username: string, password: string): Promise<User> {
		const user = await this.findUserByUsername(username);
		if (!user) {
			throw new Error('User not found');
		}

		const isValid = await verifyPassword(password, user.password_hash);
		if (!isValid) {
			throw new Error('Invalid password');
		}

		await this.updateLastLogin(user.id);
		return user;
	}

	private async updateLastLogin(userId: number): Promise<void> {
		await this.db
			.prepare(
				`
            UPDATE users
            SET last_login = CURRENT_TIMESTAMP
            WHERE id = ?
        `
			)
			.bind(userId)
			.run();
	}
}
