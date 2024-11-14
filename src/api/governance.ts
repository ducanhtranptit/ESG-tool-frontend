import ApiSender from "./config";

export default class GovernanceAPI {
	public static async getDataForSexRatioChart(lang: any): Promise<any> {
		const url = `/webapp/governance/chart-sex-ratio?lang=${lang}`;
		return await ApiSender.get(url);
	}
	public static async getDataForSupplierRatioChart(lang: any): Promise<any> {
		const url = `/webapp/governance/chart-supplier-ratio?lang=${lang}`;
		return await ApiSender.get(url);
	}
	public static async getDataForViolateChart(lang: any): Promise<any> {
		const url = `/webapp/governance/chart-violate?lang=${lang}`;
		return await ApiSender.get(url);
	}

}
