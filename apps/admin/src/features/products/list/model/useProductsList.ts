import {useQuery} from "@tanstack/react-query";
import {productsApi, type ProductsQuery} from "@/shared/api/products/productsApi.ts";

export function useProductsList(query: ProductsQuery) {
    return useQuery({
        queryKey: ['admin-products', query],
        queryFn: () => productsApi.list(query),
        placeholderData: (previous) => previous,
        staleTime: 0,
    });
}
