import ApiSender from "./config";

export default class UserAPI {
	public static async getProfile() {
		const url = "/users/profile";
		return await ApiSender.get(url);
	}
}
