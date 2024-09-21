import http from "./http";
import { AxiosResponse, AxiosError } from "axios";

export default class ApiSender {
	private static handleResponse(res: AxiosResponse) {
		if (res?.status >= 200 && res?.status < 300) {
			return res?.data;
		} else {
			throw new Error(res.statusText);
		}
	}

	private static async handleError(error: AxiosError) {
		console.error(error);
		if (error.response) {
			return error.response.data;
		} else if (error.request) {
			return error.request;
		} else {
			return error.message;
		}
	}

	public static async get<T>(
		url: string,
		params: Record<string, unknown> = {}
	): Promise<T> {
		return await http
			.get(url, { params })
			.then(ApiSender.handleResponse)
			.catch(ApiSender.handleError);
	}

	public static async post<T>(
		url: string,
		formData: Record<string, unknown> = {}
	): Promise<T> {
		return await http
			.post(url, formData)
			.then(ApiSender.handleResponse)
			.catch(ApiSender.handleError);
	}

	public static async put<T>(
		url: string,
		data: Record<string, unknown> = {}
	): Promise<T> {
		return await http
			.put(url, data)
			.then(ApiSender.handleResponse)
			.catch(ApiSender.handleError);
	}

	public static async delete<T>(
		url: string,
		config: Record<string, unknown> = {}
	): Promise<T> {
		return await http
			.delete(url, { ...config })
			.then(ApiSender.handleResponse)
			.catch(ApiSender.handleError);
	}
}
