import ApiSender from "./config";

export default class CompanyInforAPI extends ApiSender {
	public static async getAllCompanyInfor(): Promise<any> {
		const url = "/webapp/user/get-all-company-infor";
		return await CompanyInforAPI.get(url);
	}
	public static async updateCompanyInfor(data: any): Promise<any> {
		const url = "/webapp/user/update-company-infor";
		return await CompanyInforAPI.post(url, data);
	}
}
