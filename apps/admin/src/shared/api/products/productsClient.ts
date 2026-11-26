import axios from "axios";
import {errorTranslations} from "@/shared/components/localization.ts";

export const productsClient = axios.create({
    baseURL: '/api/v1/products',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    },
})

productsClient.interceptors.response.use((response) => {
    console.log('res', response);
    return response.data;
}, async (error) => {

    console.log(error);
    const serverMessage = error.response?.data?.message || error.response?.data;

    const errorMessage = typeof serverMessage === 'string' ? serverMessage : 'Something went wrong';

    return Promise.reject(new Error(errorTranslations[errorMessage]));
})