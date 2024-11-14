import TelegramBot from 'node-telegram-bot-api';

interface TelegramBotOptions {
	request?: any;
	baseApiUrl?: string;
	testEnvironment?: boolean;
}

interface TelegramBotContext {
	token: string;
	options: TelegramBotOptions;
	_buildURL: (path: string) => string;
	_fixReplyMarkup: (options: any) => void;
	_fixEntitiesField: (options: any) => void;
	_fixReplyParameters: (options: any) => void;
}

interface RequestOptions {
	form?: Record<string, any>;
	formData?: Record<
		string,
		{
			value: Buffer | Blob | any;
			options?: {
				filename?: string;
				contentType?: string;
			};
		}
	>;
	qs?: Record<string, any>;
}

async function customRequest(this: TelegramBotContext, path: string, options: RequestOptions = {}): Promise<any> {
	if (!this.token) {
		return Promise.reject(new Error('Telegram Bot Token not provided!'));
	}

	if (this.options.request) {
		Object.assign(options, this.options.request);
	}

	if (options.form) {
		this._fixReplyMarkup(options.form);
		this._fixEntitiesField(options.form);
		this._fixReplyParameters(options.form);
	}

	if (options.qs) {
		this._fixReplyMarkup(options.qs);
		this._fixReplyParameters(options.qs);
	}

	const fetchOptions: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (options.form) {
		if (options.formData) {
			const formData = new FormData();

			for (const [key, value] of Object.entries(options.form)) {
				if (value !== undefined && value !== null) {
					formData.append(key, value.toString());
				}
			}

			for (const [key, value] of Object.entries(options.formData)) {
				if (value && typeof value === 'object' && 'value' in value) {
					const blob = value.value instanceof Buffer ? new Blob([value.value]) : value.value;

					formData.append(key, blob, value.options?.filename);
				}
			}

			delete (fetchOptions.headers as Record<string, string>)['Content-Type'];
			fetchOptions.body = formData;
		} else {
			fetchOptions.body = JSON.stringify(options.form);
		}
	}

	let url = this._buildURL(path);
	if (options.qs) {
		const queryString = new URLSearchParams(
			Object.fromEntries(
				Object.entries(options.qs).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : String(value)])
			)
		).toString();
		url += `?${queryString}`;
	}

	try {
		const response = await fetch(url, fetchOptions);
		const data = (await response.json()) as {
			ok: boolean;
			result?: any;
			error_code?: number;
			description?: string;
		};

		if (data.ok) {
			return data.result;
		}

		throw new Error(`${data.error_code} ${data.description}`);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(String(error));
	}
}

// Apply the custom request function to TelegramBot prototype
(TelegramBot as any).prototype._request = customRequest;

// Export the type augmentation for TypeScript
declare module 'node-telegram-bot-api' {
	interface TelegramBot {
		_request(path: string, options?: RequestOptions): Promise<any>;
	}
}
