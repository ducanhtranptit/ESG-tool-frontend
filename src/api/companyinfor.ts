import ApiSender from "./config";

export default class CompanyInforAPI {
	public static async getAllCompanyInfor(): Promise<any> {
		const url = "/webapp/user/get-all-company-infor";
		return await ApiSender.get(url);
	}
	public static async updateCompanyInfor(data: any): Promise<any> {
		const url = "/webapp/user/update-company-infor";
		return await ApiSender.post(url, data);
	}
}
