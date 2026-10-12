import {useQuery} from "@tanstack/react-query";
import {productsApi} from "@/shared/api/products/productsApi.js";


export function useProductsList() {
    return useQuery({
        queryKey: ['products'],
        queryFn: productsApi.list,
        staleTime: 5 * 60 * 1000,
    });
}