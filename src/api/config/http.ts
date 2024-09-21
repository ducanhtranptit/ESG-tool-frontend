import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { includes } from "lodash";
import baseUrl from "../../config/url-config";
import { getCookie, removeCookie, setCookie } from "../../utils/cookie";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../config";

interface TokenPayload {
	exp?: number;
}

const listUrlNotAuthen: string[] = ["/auth/login"];

const http = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-type": "application/json",
	},
});

// Interceptor cho request
http.interceptors.request.use(
	async function (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> {
		let accessToken: string | undefined = getCookie(ACCESSTOKEN_KEY);

		// Kiểm tra nếu URL yêu cầu không nằm trong danh sách URL không yêu cầu xác thực
		if (!includes(listUrlNotAuthen, config.url || "")) {
			try {
				if (accessToken) {
					const { exp }: TokenPayload = jwtDecode(accessToken);
					// Kiểm tra token đã hết hạn hay chưa
					if (!exp || (exp && Date.now() > exp * 1000)) {
						await getToken((act) => {
							if (act) accessToken = act;
						});
					}
				} else {
					// Trường hợp không có accessToken, cần lấy lại
					await getToken((act) => {
						if (act) accessToken = act;
					});
				}
			} catch {
				// Nếu lỗi xảy ra, lấy lại token
				await getToken((act) => {
					if (act) accessToken = act;
				});
			}
		}

		// Nếu có headers và accessToken, thiết lập Authorization
		if (config.headers && accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	function (error: any) {
		return Promise.reject(error);
	}
);

// Interceptor cho response
http.interceptors.response.use(
	async function (response: AxiosResponse): Promise<AxiosResponse> {
		if (response.data.status === 401) {
			await getToken(() => {});
		}
		return response; // Đảm bảo luôn trả về response
	},
	async function (error: any): Promise<any> {
		if (error.response?.data?.status === 401) {
			await getToken(() => {});
		}
		return Promise.reject(error); // Luôn trả về hoặc reject với lỗi
	}
);

// Hàm lấy token mới
const getToken = async (fnSuccess: (accessToken: string | null) => void) => {
	const refreshToken = getCookie(REFRESHTOKEN_KEY);
	const res = await axios.post(
		`${baseUrl}/users/refresh-token`,
		{
			refreshToken,
		},
		{
			headers: {
				"Content-type": "application/json",
			},
		}
	);

	let isSuccess = false;
	if (res.data.status === 200) {
		if (res.data.data.accessToken && res.data.data.refreshToken) {
			isSuccess = true;
			setCookie(ACCESSTOKEN_KEY, res.data.data.accessToken, {
				expires: 0.5,
			});
			setCookie(REFRESHTOKEN_KEY, res.data.data.refreshToken, {
				expires: 1,
			});
			fnSuccess(res.data.data.accessToken);
		}
	}
	if (!isSuccess) {
		removeCookie(ACCESSTOKEN_KEY);
		removeCookie(REFRESHTOKEN_KEY);
		fnSuccess(null);
	}
};

export default http;
