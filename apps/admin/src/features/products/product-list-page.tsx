import {useCallback, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PageHeader} from "../dashboard/components/PageHeader.tsx";
import {DataTable} from "@/shared/ui/data-table/data-table.tsx";
import {createProductColumns} from "./list/model/columns.tsx";
import {Button} from "@site/ui/button";
import {ConfirmDialog} from "@site/ui/confirm-dialog";
import {Plus} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {useProductsList} from "@/features/products/list/model/useProductsList.ts";
import {productsApi, type AdminProduct, type ProductsQuery} from "@/shared/api/products/productsApi.ts";
import {downloadProductsCsv} from "@/features/products/list/model/exportProducts.ts";

const initialQuery: ProductsQuery = {page: 0, pageSize: 8, q: "", status: "all", sortBy: "createdAt", sortDirection: "desc"};

export function ProductListPage() {
    const [query, setQuery] = useState(initialQuery);
    const [actionError, setActionError] = useState<string | null>(null);
    const [pendingDeleteProduct, setPendingDeleteProduct] = useState<{id: string; name?: string} | null>(null);
    const [isExporting, setIsExporting] = useState(false);
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
        setPendingDeleteProduct(product);
    }, []);

    const columns = useMemo(
        () => createProductColumns({onDeleteProduct: handleDeleteProduct}),
        [handleDeleteProduct],
    );

    const handleExport = useCallback(async () => {
        if (isExporting) return;
        setIsExporting(true);
        setActionError(null);
        try {
            const allRows: AdminProduct[] = [];
            let currentPage = 0;
            let pageCount = 1;
            const maxPages = 50;
            do {
                const exportPage = await productsApi.list({...query, page: currentPage, pageSize: 100});
                allRows.push(...exportPage.data);
                pageCount = Math.max(1, exportPage.meta.pageCount || 1);
                currentPage += 1;
            } while (currentPage < pageCount && currentPage < maxPages);

            downloadProductsCsv(allRows);
        } catch (err) {
            if (data?.data?.length) {
                downloadProductsCsv(data.data);
            } else {
                setActionError(err instanceof Error ? err.message : "Не удалось экспортировать товары");
            }
        } finally {
            setIsExporting(false);
        }
    }, [query, data, isExporting]);

    return (
        <div className="w-full px-4 pb-10 sm:px-6 lg:px-8">
            <PageHeader title="Товары" description="Каталог, варианты и остатки" />

            {actionError && (
                <p role="alert" className="mt-4 rounded-xl bg-[#FF3B30]/10 px-4 py-2.5 text-sm font-medium text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]">
                    {actionError}
                </p>
            )}

            {isLoading && (
                <p className="mt-6 text-sm text-[#8E8E93]">Загрузка товаров...</p>
            )}

            {isError && (
                <div role="alert" className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-[#FF3B30]/10 p-4 text-sm text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]">
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
                        isExporting={isExporting}
                        onBulkStatusChange={(ids, status) => bulkStatusMutation.mutateAsync({ids, status})}
                        onBulkDelete={(ids) => bulkDeleteMutation.mutateAsync(ids)}
                        isBulkPending={bulkStatusMutation.isPending || bulkDeleteMutation.isPending || deleteMutation.isPending}
                    />
                    {isFetching && <div aria-live="polite" className="sr-only">Обновление списка товаров</div>}
                </section>
            )}

            <ConfirmDialog
                open={Boolean(pendingDeleteProduct)}
                onOpenChange={(open) => {
                    if (!open) setPendingDeleteProduct(null);
                }}
                title="Удалить товар?"
                description={`Товар «${pendingDeleteProduct?.name || "Без названия"}» будет удалён без возможности восстановления.`}
                cancelLabel="Отмена"
                confirmLabel="Удалить"
                destructive
                onConfirm={() => {
                    if (pendingDeleteProduct) {
                        deleteMutation.mutate(pendingDeleteProduct.id);
                    }
                    setPendingDeleteProduct(null);
                }}
            />
        </div>
    );
}

function ProductsAddButton() {
    const navigate = useNavigate();
    return <Button type="button" onClick={() => navigate(`create`)}><Plus/>Добавить товар</Button>;
}
