import ApiSender from "./config";

export default class EnvironmentAPI {
	public static async getDataForEmissionChart(): Promise<any> {
		const url = "/environment/chart-emission";
		return await ApiSender.get(url);
	}
	public static async getDataForWaterChart(): Promise<any> {
		const url = "/environment/chart-water";
		return await ApiSender.get(url);
	}
	public static async getDataForWasteChart(): Promise<any> {
		const url = "/environment/chart-waste";
		return await ApiSender.get(url);
	}
	public static async getDataForElectricityChart(): Promise<any> {
		const url = "/environment/chart-electricity";
		return await ApiSender.get(url);
	}
	public static async getDataForInkPapersChart(): Promise<any> {
		const url = "/environment/chart-ink-papers";
		return await ApiSender.get(url);
	}
}
