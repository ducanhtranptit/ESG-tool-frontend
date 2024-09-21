import Cookies, { CookieAttributes } from "js-cookie";

export const setCookie = (key: string, value: string, options: CookieAttributes = {}) => {
    Cookies.set(key, value, { expires: 0.9, ...options });
};

export const getCookie = (key: string): string | undefined => {
    return Cookies.get(key);
};

export const removeCookie = (key: string): void => {
    Cookies.remove(key);
};
