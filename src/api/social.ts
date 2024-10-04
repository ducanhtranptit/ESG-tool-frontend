import ApiSender from "./config";

export default class SocialAPI {
	public static async getDataForSexRatioChart(): Promise<any> {
		const url = "/social/chart-sex-ratio";
		return await ApiSender.get(url);
	}
	public static async getDataForTrainingChart(): Promise<any> {
		const url = "/social/chart-training";
		return await ApiSender.get(url);
	}
	public static async getDataForSalaryChangeChart(): Promise<any> {
		const url = "/social/chart-salary-change";
		return await ApiSender.get(url);
	}
	public static async getDataForRiskChart(): Promise<any> {
		const url = "/social/chart-risk";
		return await ApiSender.get(url);
	}
	public static async getDataForExpenditureChart(): Promise<any> {
		const url = "/social/chart-expenditure";
		return await ApiSender.get(url);
	}
}
