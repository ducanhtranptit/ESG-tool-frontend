import ApiSender from "./config";
export default class TargetAPI extends ApiSender {
	public static async getAllData(section: any, lang: any): Promise<any> {
		const url = `/webapp/questions/get-all-topics-and-questions/?section=${section}&lang=${lang}`;
		return await TargetAPI.get(url);
	}
	public static async getAllSectionData(
		year: number,
	): Promise<any> {
		const url = `/webapp/targets/get-all-submitcount-of-section?year=${year}`;
		return await TargetAPI.get(url);
	}
	public static async addAnswerOfCompany(
		data: any,
		targetType: string
	): Promise<any> {
		const url = `/webapp/targets/add-answer?targetType=${targetType}`;
		return await TargetAPI.post(url, data);
	}

	public static async getAnswersOfYear(
		year: any,
		section: any,
		lang: any,
		targetType: any
	): Promise<any> {
		const url = `/webapp/targets/get-all-answers-of-year?section=${section}&year=${year}&lang=${lang}&targetType=${targetType}`;
		return await TargetAPI.get(url);
	}
}
