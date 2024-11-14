import { DatabaseService } from '../services/db';
import { ApiResponse } from '../types/api';
import { Task } from '../types/db';
import { Env } from '../types/env';

export async function handleCreateTask(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
		const db = DatabaseService.getInstance(env);
		const task = await db.createTask(body);

		const response: ApiResponse & { data: Task } = {
			success: true,
			data: task,
		};

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create task',
		};

		return new Response(JSON.stringify(response), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function handleGetTasks(env: Env): Promise<Response> {
	try {
		const db = DatabaseService.getInstance(env);
		const tasks = await db.getTasks();

		const response: ApiResponse & { data: Task[] } = {
			success: true,
			data: tasks,
		};

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch tasks',
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
