import axios from "axios";
import {errorTranslations} from "@/shared/components/localization.jsx";

export const authClient = axios.create({
    baseURL: '/auth',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

authClient.interceptors.response.use((response) => {
    console.log(response);
    return response;
}, async (error) => {

    console.log(error);
    const serverMessage = error.response?.data?.message || error.response?.data;

    const errorMessage = typeof serverMessage === 'string' ? serverMessage : 'Something went wrong';

    return Promise.reject(new Error(errorTranslations[errorMessage]));
})