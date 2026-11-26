import {useQuery} from "@tanstack/react-query";
import {DataTable} from "@/shared/ui/data-table/data-table.tsx";
import {columns} from "./list/model/columns.tsx";
import {PageHeader} from "@/features/dashboard/components/PageHeader.tsx";
import {ordersApi} from "@/shared/api/orders/ordersApi.ts";

export function OrdersListPage() {
    const {data = [], isLoading, isError, error} = useQuery({
        queryKey: ["admin", "orders"],
        queryFn: ordersApi.list,
        staleTime: 30_000,
    });

    return (
        <main className="min-h-full bg-[#F2F2F7] px-4 pb-10 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader title="Заказы" description="Заказы из базы данных" />
                {isLoading && <p className="mt-5 text-sm text-muted-foreground">Загружаем заказы…</p>}
                {isError && <p role="alert" className="mt-5 text-sm text-red-600">Не удалось загрузить заказы: {error.message}</p>}
                {!isLoading && !isError && (
                    <section className="mt-5">
                        <DataTable data={data} columns={columns} />
                    </section>
                )}
            </div>
        </main>
    );
}
