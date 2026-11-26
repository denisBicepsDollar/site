import {DataTable} from "@/shared/ui/data-table/data-table.tsx"
import {columns} from "./list/model/columns.tsx"
import {data} from "@/shared/mock/data-orders.ts"
import {PageHeader} from "@/features/dashboard/components/PageHeader.tsx";

export function OrdersListPage() {
    return (
        <main className="min-h-full  bg-[#F2F2F7] px-4 pb-10 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader
                    title="Заказы"
                    description="Каталог, варианты и остатки"
                    
                />

                <section className="mt-5">
                    <DataTable data={data} columns={columns}/>
                </section>
            </div>
        </main>
    )
}