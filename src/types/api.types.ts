export interface ApiResponse {
	success: boolean;
	message?: string;
	error?: string;
	[key: string]: any;
}
