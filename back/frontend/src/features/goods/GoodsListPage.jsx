import {PageHeader} from "../dashboard/components/PageHeader.jsx"
import {DataTable} from "@/components/ui/data-table/data-table.jsx"
import {columns} from "./catalog/model/columns.jsx"
import {data} from "@/components/shared/data.js"
import {GoodsToolbar} from "./catalog/components/GoodsToolbar.jsx";

export function GoodsListPage() {
    return (
        <main className="min-h-full  bg-[#F2F2F7] px-4 pb-10 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader
                    title="Товары"
                    description="Каталог, варианты и остатки"
                    summary={'8 позиций\n' +
                        '·\n' +
                        '5 активных\n' +
                        '·\n' +
                        '1 заканчиваются'}
                />

                <section className="mt-5">
                    <GoodsToolbar/>
                    <DataTable data={data} columns={columns}/>
                </section>
            </div>
        </main>
    )
}