import ApiSender from "./config";

export default class EnvironmentAPI {
	public static async testApi(): Promise<any> {
		const url = "/environment/test";
		return await ApiSender.get(url);
	}
}
