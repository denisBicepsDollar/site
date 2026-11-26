import {productsClient} from "@/shared/api/products/productsClient.ts";

export const productsApi = {
    list: () => productsClient.get("/"),
}