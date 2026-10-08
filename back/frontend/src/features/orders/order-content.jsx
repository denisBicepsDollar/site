import {DataTable} from "@/components/ui/data-table/data-table.jsx"
import {columns} from "@/features/orders/catalog/model/columns.jsx"
import {data} from "@/components/shared/data-orders.js"
import {PageHeader} from "@/features/dashboard/components/PageHeader.jsx";

export function OrdersListPage() {
    return (
        <main className="min-h-full  bg-[#F2F2F7] px-4 pb-10 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader
                    title="Заказы"
                    description="Каталог, варианты и остатки"
                    summary={'Выручка за период - 42 4241 2 новых - разобрать'}
                />

                <section className="mt-5">
                    <DataTable data={data} columns={columns}/>
                </section>
            </div>
        </main>
    )
}