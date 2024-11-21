import { Env } from './core/types/env.types';
import { handleRegister } from './telegram/handlers/register.handler';
import { handleWebhook } from './telegram/handlers/webhook.handler';
import { AIService } from './core/services/ai.service';
import { UserService } from './core/services/user.service';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		try {
			AIService.initialize(env.GROQ_API_KEY);
			UserService.initialize(env.DB);

			const url = new URL(request.url);

			switch (url.pathname) {
				case '/create-tables':
					await UserService.getInstance().createTables();
					return new Response('Tables created', { status: 200 });
				case '/register':
					return handleRegister(request, env);
				case '/webhook':
					return handleWebhook(request, env);
				default:
					return new Response('Not Found', { status: 404 });
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return new Response(`Error: ${errorMessage}`, { status: 500 });
		}
	},
};
