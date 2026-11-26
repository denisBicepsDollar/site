import axios from "axios";
import {errorTranslations} from "@/shared/components/localization.ts";

export const ordersClient = axios.create({
    baseURL: "/api/v1/admin/orders",
    timeout: 15000,
    withCredentials: true,
    headers: {"Content-Type": "application/json"},
});

ordersClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== "undefined") {
            window.dispatchEvent(new window.Event("admin:unauthorized"));
        }

        const serverMessage = axios.isAxiosError(error)
            ? error.response?.data?.message ?? error.response?.data?.error ?? error.response?.data
            : undefined;
        const message = typeof serverMessage === "string"
            ? serverMessage
            : "Something went wrong";
        return Promise.reject(new Error(errorTranslations[message] ?? message));
    },
);
