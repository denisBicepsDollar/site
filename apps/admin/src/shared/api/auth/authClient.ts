import axios from "axios";
import {errorTranslations} from "@/shared/components/localization.ts";

export const authClient = axios.create({
    baseURL: '/auth/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

authClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const serverMessage = axios.isAxiosError(error)
            ? error.response?.data?.message ?? error.response?.data?.error ?? error.response?.data
            : undefined;
        const message = typeof serverMessage === "string"
            ? serverMessage
            : "Something went wrong";

        return Promise.reject(new Error(errorTranslations[message] ?? message));
    },
);
