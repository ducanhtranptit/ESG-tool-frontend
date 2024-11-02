import ApiSender from "./config";

export default class QuestionAPI {
	public static async getAllData(section: any): Promise<any> {
		const url = `/webapp/questions/get-all-topics-and-questions/${section}`;
		return await ApiSender.get(url);
	}
	public static async addAnswerOfCompany(data: any): Promise<any> {
		const url = "/webapp/questions/add-answer";
		return await ApiSender.post(url, data);
	}
}
