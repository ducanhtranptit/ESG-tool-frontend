import ApiSender from "./config";

export default class SocialAPI extends ApiSender {
	public static async getDataForSexRatioChart(lang: any): Promise<any> {
		const url = `/webapp/social/chart-sex-ratio?lang=${lang}`;
		return await SocialAPI.get(url);
	}
	public static async getDataForTrainingChart(lang: any): Promise<any> {
		const url = `/webapp/social/chart-training?lang=${lang}`;
		return await SocialAPI.get(url);
	}
	public static async getDataForSalaryChangeChart(lang: any): Promise<any> {
		const url = `/webapp/social/chart-salary-change?lang=${lang}`;
		return await SocialAPI.get(url);
	}
	public static async getDataForRiskChart(lang: any): Promise<any> {
		const url = `/webapp/social/chart-risk?lang=${lang}`;
		return await SocialAPI.get(url);
	}
	public static async getDataForExpenditureChart(lang: any): Promise<any> {
		const url = `/webapp/social/chart-expenditure?lang=${lang}`;
		return await SocialAPI.get(url);
	}
}
