import ApiSender from "./config";

export default class QuestionAPI {
	public static async getAllData(section: any, lang:any): Promise<any> {
		const url = `/webapp/questions/get-all-topics-and-questions/?section=${section}&lang=${lang}`;
		return await ApiSender.get(url);
	}
	
	public static async getAnswersOfYear(year: any, section: any, lang: any): Promise<any> {
		const url = `/webapp/questions/get-all-answers-of-year?section=${section}&year=${year}&lang=${lang}`;
		return await ApiSender.get(url);
	}	
	
	public static async addAnswerOfCompany(data: any, lang:any): Promise<any> {
		const url = `/webapp/questions/add-answer?lang=${lang}`;
		return await ApiSender.post(url, data);
	}
	public static async getAllSectionSubmitCount(year: number): Promise<any> {
		const url = `/webapp/questions/get-all-submitcount-of-section?year=${year}`;
		return await ApiSender.get(url);
	}
}
