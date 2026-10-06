import {ClipboardList} from "lucide-react";
import {EmptyState} from "../../shared/ui/EmptyState.jsx";
import {PageHeader} from "../dashboard/components/PageHeader.jsx";

export function OrdersContent() {
    return (
        <div
            className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <PageHeader
                title="Заказы"
                description="Просматривайте новые заказы, оплату и доставку."
            />
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-950/[0.02]">
                <EmptyState
                    icon={ClipboardList}
                    title="Заказов пока нет"
                    description="Здесь появится список заказов магазина после подключения данных из API."
                />
            </section>
        </div>
    );
}