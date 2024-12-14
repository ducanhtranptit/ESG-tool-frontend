import ApiSender from "./config";

export default class EnvironmentAPI extends ApiSender {
	public static async getDataForEmissionChart(): Promise<any> {
		const url = `/webapp/environment/chart-emission`;
		return await EnvironmentAPI.get(url);
	}
	public static async getDataForWaterChart(lang: any): Promise<any> {
		const url = `/webapp/environment/chart-water?lang=${lang}`;
		return await EnvironmentAPI.get(url);
	}
	public static async getDataForWasteChart(lang: any): Promise<any> {
		const url = `/webapp/environment/chart-waste?lang=${lang}`;
		return await EnvironmentAPI.get(url);
	}
	public static async getDataForElectricityChart(lang: any): Promise<any> {
		const url = `/webapp/environment/chart-electricity?lang=${lang}`;
		return await EnvironmentAPI.get(url);
	}
	public static async getDataForInkPapersChart(lang: any): Promise<any> {
		const url = `/webapp/environment/chart-ink-papers?lang=${lang}`;
		return await EnvironmentAPI.get(url);
	}
}
