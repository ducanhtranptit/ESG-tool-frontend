import ApiSender from "./config";

export default class GovernanceAPI {
	public static async getDataForSexRatioChart(): Promise<any> {
		const url = "/governance/chart-sex-ratio";
		return await ApiSender.get(url);
	}
	public static async getDataForSupplierRatioChart(): Promise<any> {
		const url = "/governance/chart-supplier-ratio";
		return await ApiSender.get(url);
	}
	public static async getDataForViolateChart(): Promise<any> {
		const url = "/governance/chart-violate";
		return await ApiSender.get(url);
	}

}
