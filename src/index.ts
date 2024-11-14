import { Env } from './types/env';
import { handleRegister } from './handlers/register';
import { handleWebhook } from './handlers/webhook';
import { AIService } from './services/ai';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		try {
			AIService.initialize(env.GROQ_API_KEY);
			const url = new URL(request.url);

			switch (url.pathname) {
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
