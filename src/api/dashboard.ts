import ApiSender from "./config";

export default class DashboardAPI extends ApiSender {
	public static async getAllData(): Promise<any> {
		const url = "/webapp/dashboard/get-all-data";
		return await DashboardAPI.get(url);
	}
}
