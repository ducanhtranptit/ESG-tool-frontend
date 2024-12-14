import ApiSender from "./config";

export default class ReportAPI extends ApiSender {
	public static async getAllData(year: number | null): Promise<any> {
		const url = `/webapp/report/get-all-data?year=${year}`;
		return await ReportAPI.get(url);
	}
}
