import ApiSender from "./config";

interface AuthResponse {
	status: number;
	data: {
		accessToken: string;
		refreshToken: string;
	};
}

type RequestBody = {
	username?: string;
	password?: string;
};

export default class AuthAPI {
	public static login(body: RequestBody): Promise<AuthResponse> {
		const url = "/auth/login";
		return ApiSender.post(url, body);
	}

	public static register(body: RequestBody): Promise<AuthResponse> {
		const url = "/auth/register";
		return ApiSender.post(url, body);
	}

	public static async logout(): Promise<any> {
		const url = "/auth/logout";
		return await ApiSender.get(url);
	}
}
