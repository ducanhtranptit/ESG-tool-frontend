import ApiSender from "./config";

export default class QuestionAPI {
	public static async getAllData(): Promise<any> {
		const url = "/questions/get-all-topics-and-questions";
		return await ApiSender.get(url);
	}
	public static async addAnswerOfCompany(data: any): Promise<any> {
		const url = "/questions/add-answer";
		return await ApiSender.post(url, data);
	}
}
