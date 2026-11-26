import {useQuery} from "@tanstack/react-query";
import {Button} from "@site/ui/button";
import {DataTable} from "@/shared/ui/data-table/data-table.tsx";
import {columns} from "./list/model/columns.tsx";
import {PageHeader} from "@/features/dashboard/components/PageHeader.tsx";
import {ordersApi} from "@/shared/api/orders/ordersApi.ts";

export function OrdersListPage() {
    const {data = [], isLoading, isError, error, refetch} = useQuery({
        queryKey: ["admin", "orders"],
        queryFn: ordersApi.list,
        staleTime: 0,
    });

    return (
        <main className="min-h-full bg-[#F2F2F7] px-4 pb-10 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader title="Заказы" description="Заказы из базы данных" />
                {isLoading && <p className="mt-5 text-sm text-muted-foreground">Загружаем заказы…</p>}
                {isError && (
                    <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-[#FF3B30]/10 p-4 text-sm text-[#D70015]">
                        <span>Не удалось загрузить заказы: {error.message}</span>
                        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                            Повторить
                        </Button>
                    </div>
                )}
                {!isLoading && !isError && (
                    <section className="mt-5">
                        <DataTable data={data} columns={columns} />
                    </section>
                )}
            </div>
        </main>
    );
}
