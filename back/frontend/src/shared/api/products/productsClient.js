import axios from "axios";
import {errorTranslations} from "@/shared/components/localization.jsx";
import {authClient} from "@/shared/api/auth/authClient.js";

export const productsClient = axios.create({
    baseURL: 'http://localhost:3000/api/products',
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