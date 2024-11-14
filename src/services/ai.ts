import { createGroq } from '@ai-sdk/groq';
import { CoreMessage, generateText } from 'ai';
import { SYSTEM_PROMPT } from '../config/prompts';

export class AIService {
	private groq;
	private static instance: AIService;

	private constructor(apiKey: string) {
		this.groq = createGroq({ apiKey });
	}

	static initialize(apiKey: string): void {
		if (!AIService.instance) {
			AIService.instance = new AIService(apiKey);
		}
	}

	static getInstance(): AIService {
		if (!AIService.instance) {
			throw new Error('AIService must be initialized with an API key first');
		}
		return AIService.instance;
	}

	async generateResponse(userMessage: string): Promise<string> {
		const messages: CoreMessage[] = [
			{
				role: 'system',
				content: SYSTEM_PROMPT,
			},
			{
				role: 'user',
				content: userMessage,
			},
		];

		try {
			const { text } = await generateText({
				model: this.groq('llama-3.1-70b-versatile'),
				messages,
				temperature: 0.7,
				maxTokens: 1000,
			});

			return text;
		} catch (error) {
			console.error('AI generation error:', error);
			throw new Error('Failed to generate AI response');
		}
	}
}
