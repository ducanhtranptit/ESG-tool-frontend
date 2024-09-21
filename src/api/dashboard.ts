import ApiSender from "./config";

export default class DashboardAPI {
	public static async getAllData(): Promise<any> {
		const url = "/dashboard/get-all-data";
		return await ApiSender.get(url);
	}
}
