import {PageHeader} from "../dashboard/components/PageHeader.tsx"
import {DataTable} from "@/shared/ui/data-table/data-table.tsx"
import {columns} from "./list/model/columns.tsx"
import {Button} from "@site/ui/button";
import {Plus} from 'lucide-react'
import {useNavigate} from "react-router-dom";
import {Notification} from "@/features/layout/notification/notification.tsx";
import {useProductsList} from "@/features/products/list/model/useProductsList.ts";

export function ProductListPage() {
    const {data, isLoading, isError, error} = useProductsList();

    if (isLoading) {
        return <div>Загрузка товаров...</div>;
    }

    // 2. Если интерцептор Axios поймал ошибку (например, 500 или CORS)
    if (isError) {
        return <div className="text-red-500">Произошла ошибка: {error.message}</div>;
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <PageHeader
                title="Товары"
                description="Каталог, варианты и остатки"
            />

            <section className="mt-2">
                <DataTable data={data} columns={columns} action={<ProductsAddButton/>}/>
            </section>
            <div className="fixed top-4 right-4 z-50 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
                <Notification initialCount={3}/>
            </div>
        </div>
    )
}

function ProductsAddButton() {
    const navigate = useNavigate();
    return (
        <Button
            onClick={() => navigate(`create`)}>
            <Plus/>
            Добавить товар
        </Button>
    );
}