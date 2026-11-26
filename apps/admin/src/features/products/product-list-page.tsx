import {useCallback, useState} from "react";
import {PageHeader} from "../dashboard/components/PageHeader.tsx";
import {DataTable} from "@/shared/ui/data-table/data-table.tsx";
import {columns} from "./list/model/columns.tsx";
import {Button} from "@site/ui/button";
import {Plus} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {Notification} from "@/features/layout/notification/notification.tsx";
import {useProductsList} from "@/features/products/list/model/useProductsList.ts";
import type {ProductsQuery} from "@/shared/api/products/productsApi.ts";

const initialQuery: ProductsQuery = {page: 0, pageSize: 8, q: "", status: "all", sortBy: "createdAt", sortDirection: "desc"};

export function ProductListPage() {
    const [query, setQuery] = useState(initialQuery);
    const {data, isLoading, isFetching, isError, error} = useProductsList(query);
    const handleQueryChange = useCallback((next: ProductsQuery) => {
        setQuery((current) => {
            const changedFilter = current.q !== next.q || current.status !== next.status || current.lowStock !== next.lowStock || current.sortBy !== next.sortBy || current.sortDirection !== next.sortDirection;
            return {...next, page: changedFilter ? 0 : next.page};
        });
    }, []);

    if (isLoading) return <div>Загрузка товаров...</div>;
    if (isError) return <div className="text-red-500">Произошла ошибка: {error.message}</div>;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <PageHeader title="Товары" description="Каталог, варианты и остатки" />
            <section className="mt-2">
                <DataTable
                    data={data?.data ?? []}
                    columns={columns}
                    action={<ProductsAddButton/>}
                    meta={data?.meta}
                    onQueryChange={handleQueryChange}
                    isFetching={isFetching}
                />
                {isFetching && <div aria-live="polite" className="sr-only">Обновление списка товаров</div>}
            </section>
            <div className="fixed top-4 right-4 z-50 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
                <Notification/>
            </div>
        </div>
    );
}

function ProductsAddButton() {
    const navigate = useNavigate();
    return <Button onClick={() => navigate(`create`)}><Plus/>Добавить товар</Button>;
}
