import {useQuery} from "@tanstack/react-query";
import {productsApi} from "@/shared/api/products/productsApi.ts";


export function useProductsList() {
    return useQuery({
        queryKey: ['products'],
        queryFn: productsApi.list,
        staleTime: 5 * 60 * 1000,
    });
}