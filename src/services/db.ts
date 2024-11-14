import { PrismaClient } from '@prisma/client';
import { D1Database } from '@cloudflare/workers-types';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Task } from '../types/db';
import { Env } from '../types/env';

export class DatabaseService {
	private static instance: DatabaseService;
	private prisma: PrismaClient;

	private constructor(d1: D1Database) {
		this.prisma = new PrismaClient({
			adapter: new PrismaD1(d1),
		});
	}

	public static getInstance(env: Env): DatabaseService {
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService(env.DB);
		}
		return DatabaseService.instance;
	}

	async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
		return this.prisma.task.create({
			data: task,
		});
	}

	async getTasks(): Promise<Task[]> {
		return this.prisma.task.findMany({
			orderBy: {
				dueDate: 'asc',
			},
		});
	}

	async getTask(id: number): Promise<Task | null> {
		return this.prisma.task.findUnique({
			where: { id },
		});
	}

	async updateTask(id: number, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> {
		return this.prisma.task.update({
			where: { id },
			data: task,
		});
	}

	async deleteTask(id: number): Promise<Task> {
		return this.prisma.task.delete({
			where: { id },
		});
	}
}
