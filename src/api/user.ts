import ApiSender from "./config";

export default class UserAPI extends ApiSender {
	public static async getProfile() {
		const url = "/users/profile";
		return await UserAPI.get(url);
	}
}
