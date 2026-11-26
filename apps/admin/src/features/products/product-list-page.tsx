import {useCallback, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PageHeader} from "../dashboard/components/PageHeader.tsx";
import {DataTable} from "@/shared/ui/data-table/data-table.tsx";
import {createProductColumns} from "./list/model/columns.tsx";
import {Button} from "@site/ui/button";
import {Plus} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {useProductsList} from "@/features/products/list/model/useProductsList.ts";
import {productsApi, type ProductsQuery} from "@/shared/api/products/productsApi.ts";
import {downloadProductsCsv} from "@/features/products/list/model/exportProducts.ts";

const initialQuery: ProductsQuery = {page: 0, pageSize: 8, q: "", status: "all", sortBy: "createdAt", sortDirection: "desc"};

export function ProductListPage() {
    const [query, setQuery] = useState(initialQuery);
    const [actionError, setActionError] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const {data, isLoading, isFetching, isError, error, refetch} = useProductsList(query);

    const handleQueryChange = useCallback((next: ProductsQuery) => {
        setQuery((current) => {
            const changedFilter = current.q !== next.q || current.status !== next.status || current.lowStock !== next.lowStock || current.sortBy !== next.sortBy || current.sortDirection !== next.sortDirection;
            return {...next, page: changedFilter ? 0 : next.page};
        });
    }, []);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productsApi.remove(id),
        onSuccess: async () => {
            setActionError(null);
            await queryClient.invalidateQueries({queryKey: ["admin-products"]});
        },
        onError: (err) => {
            setActionError(err instanceof Error ? err.message : "Не удалось удалить товар");
        },
    });

    const bulkStatusMutation = useMutation({
        mutationFn: ({ids, status}: {ids: string[]; status: string}) => productsApi.bulkUpdateStatus(ids, status),
        onSuccess: async () => {
            setActionError(null);
            await queryClient.invalidateQueries({queryKey: ["admin-products"]});
        },
        onError: (err) => {
            setActionError(err instanceof Error ? err.message : "Не удалось обновить статус товаров");
        },
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: string[]) => productsApi.bulkDelete(ids),
        onSuccess: async () => {
            setActionError(null);
            await queryClient.invalidateQueries({queryKey: ["admin-products"]});
        },
        onError: (err) => {
            setActionError(err instanceof Error ? err.message : "Не удалось удалить выбранные товары");
        },
    });

    const handleDeleteProduct = useCallback((product: {id: string; name?: string}) => {
        if (!window.confirm(`Удалить товар «${product.name || "Без названия"}»? Действие нельзя отменить.`)) {
            return;
        }
        deleteMutation.mutate(product.id);
    }, [deleteMutation]);

    const columns = useMemo(
        () => createProductColumns({onDeleteProduct: handleDeleteProduct}),
        [handleDeleteProduct],
    );

    const handleExport = useCallback(async () => {
        try {
            const exportPage = await productsApi.list({...query, page: 0, pageSize: 100});
            downloadProductsCsv(exportPage.data);
        } catch {
            downloadProductsCsv(data?.data ?? []);
        }
    }, [query, data]);

    return (
        <div className="w-full px-4 pb-10 sm:px-6 lg:px-8">
            <PageHeader title="Товары" description="Каталог, варианты и остатки" />

            {actionError && (
                <p role="alert" className="mt-4 rounded-xl bg-[#FF3B30]/10 px-4 py-2.5 text-sm font-medium text-[#D70015]">
                    {actionError}
                </p>
            )}

            {isLoading && (
                <p className="mt-6 text-sm text-[#8E8E93]">Загрузка товаров...</p>
            )}

            {isError && (
                <div role="alert" className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-[#FF3B30]/10 p-4 text-sm text-[#D70015]">
                    <span>Произошла ошибка: {error.message}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                        Повторить
                    </Button>
                </div>
            )}

            {!isLoading && !isError && (
                <section className="mt-2">
                    <DataTable
                        data={data?.data ?? []}
                        columns={columns}
                        action={<ProductsAddButton/>}
                        meta={data?.meta}
                        onQueryChange={handleQueryChange}
                        isFetching={isFetching}
                        onExport={handleExport}
                        onBulkStatusChange={(ids, status) => bulkStatusMutation.mutateAsync({ids, status})}
                        onBulkDelete={(ids) => bulkDeleteMutation.mutateAsync(ids)}
                        isBulkPending={bulkStatusMutation.isPending || bulkDeleteMutation.isPending || deleteMutation.isPending}
                    />
                    {isFetching && <div aria-live="polite" className="sr-only">Обновление списка товаров</div>}
                </section>
            )}
        </div>
    );
}

function ProductsAddButton() {
    const navigate = useNavigate();
    return <Button type="button" onClick={() => navigate(`create`)}><Plus/>Добавить товар</Button>;
}
