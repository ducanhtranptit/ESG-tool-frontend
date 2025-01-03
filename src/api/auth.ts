import ApiSender from "./config";

interface AuthResponse {
	status: number;
	data: {
		accessToken: string;
		refreshToken: string;
		user: any;
	};
	message: string;
}

type RequestBody = {
	username?: string;
	password?: string;
};

export default class AuthAPI extends ApiSender {
	public static login(body: RequestBody): Promise<AuthResponse> {
		const url = "/auth/login";
		return AuthAPI.post(url, body);
	}

	public static register(body: RequestBody): Promise<AuthResponse> {
		console.log("register", body);
		const url = "/auth/register";
		return AuthAPI.post(url, body);
	}

	public static async logout(): Promise<any> {
		const url = "/auth/logout";
		return await AuthAPI.get(url);
	}
}
