import {productsClient} from "@/shared/api/products/productsClient.js";

export const productsApi = {
    list: () => productsClient.get(),
}