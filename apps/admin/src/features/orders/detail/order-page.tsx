import {useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {CalendarDays, Printer} from "lucide-react";
import {StatusBadge} from "@/shared/ui/display/status-badge.tsx";
import {NotesSection} from "@/shared/ui/sections/notes-section.tsx";
import {CustomerPaymentCard} from "@/features/orders/detail/components/customer-card.tsx";
import {DeliveryCard} from "@/features/orders/detail/components/delivery-card.tsx";
import {OrderItemsCard} from "@/features/orders/detail/components/order-items-card.tsx";
import {OrderTimeline} from "@/features/orders/detail/components/order-timeline.tsx";
import {EntityHeader} from "@/shared/ui/sections/entity-page-header.tsx";
import {ordersApi, type AdminOrderStatus} from "@/shared/api/orders/ordersApi.ts";

const ORDER_STEPS = [
    {title: "Создан", description: "Заказ оформлен"},
    {title: "Подтверждён", description: "Заказ подтверждён"},
    {title: "Собирается", description: "Заказ готовят к отправке"},
    {title: "Отправлен", description: "Заказ передан в доставку"},
    {title: "Завершён", description: "Заказ получен клиентом"},
];

const STATUS_STEP: Record<string, number> = {
    new: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    completed: 4,
};

const NEXT_STATUS: AdminOrderStatus[] = ["confirmed", "processing", "shipped", "completed"];

export function OrderPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const orderId = Number(id);
    const queryClient = useQueryClient();
    const [note, setNote] = useState("");
    const orderQuery = useQuery({
        queryKey: ["admin", "orders", orderId],
        queryFn: () => ordersApi.getById(orderId),
        enabled: Number.isSafeInteger(orderId) && orderId > 0,
    });
    const statusMutation = useMutation({
        mutationFn: (status: AdminOrderStatus) => ordersApi.updateStatus(orderId, status),
        onSuccess: async (updatedOrder) => {
            queryClient.setQueryData(["admin", "orders", orderId], updatedOrder);
            await queryClient.invalidateQueries({queryKey: ["admin", "orders"]});
        },
    });

    const order = orderQuery.data;
    const step = order ? (STATUS_STEP[order.status] ?? 0) : 0;
    const cancelled = order?.status === "cancelled";
    const statusText = cancelled
        ? "Отменён"
        : order?.status === "completed"
            ? "Завершён"
            : ORDER_STEPS[step]?.title ?? "Новый";
    const timestamps = useMemo(() => order
        ? [new Date(order.createdAt).toLocaleString("ru-RU"), null, null, null, null]
        : [], [order]);

    if (!Number.isSafeInteger(orderId) || orderId < 1) {
        return <p role="alert" className="p-6 text-red-600">Некорректный номер заказа.</p>;
    }
    if (orderQuery.isLoading) return <p className="p-6">Загружаем заказ…</p>;
    if (orderQuery.isError || !order) {
        return <p role="alert" className="p-6 text-red-600">Не удалось загрузить заказ: {orderQuery.error?.message ?? "Заказ не найден"}</p>;
    }

    const canAdvance = !cancelled && order.status !== "completed" && step < ORDER_STEPS.length - 1;
    const nextStatus = NEXT_STATUS[step];
    const itemsTotal = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderTotal = order.summary.totalPrice || itemsTotal + order.deliveryPrice;

    return (
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black print:bg-white">
            <EntityHeader
                backLabel="К заказам"
                onBack={() => navigate("/dashboard/orders")}
                title={`Заказ ${order.orderNumber}`}
                metadata={(
                    <span className="inline-flex items-center gap-1.5">
                        <CalendarDays aria-hidden="true" className="size-3.5" />
                        {new Date(order.createdAt).toLocaleString("ru-RU")}
                    </span>
                )}
                status={<StatusBadge tone={cancelled ? "danger" : "info"} className="">{statusText}</StatusBadge>}
                actions={[
                    {
                        id: "print",
                        label: "Накладная",
                        icon: Printer,
                        onClick: () => window.print(),
                        className: "border-black/[0.08] bg-white text-[#007AFF] hover:bg-[#F2F2F7]",
                    },
                    ...(canAdvance && nextStatus ? [{
                        id: "next",
                        label: "Следующий этап",
                        variant: "default",
                        disabled: statusMutation.isPending,
                        onClick: () => statusMutation.mutate(nextStatus),
                        className: "bg-[#007AFF] px-4 text-white hover:bg-[#006FE6]",
                        confirm: {
                            title: "Перевести заказ дальше?",
                            description: `Новый статус: «${ORDER_STEPS[step + 1]?.title}».`,
                            actionLabel: "Продолжить",
                        },
                    }] : []),
                    ...(!cancelled && order.status !== "completed" ? [{
                        id: "cancel",
                        label: "Отменить заказ",
                        disabled: statusMutation.isPending,
                        onClick: () => statusMutation.mutate("cancelled"),
                        className: "border-[#FF3B30]/20 bg-white text-[#D70015] hover:bg-[#FF3B30]/10",
                        confirm: {
                            title: "Отменить заказ?",
                            description: `Заказ ${order.orderNumber} будет отменён, а резерв товара восстановлен.`,
                            actionLabel: "Отменить заказ",
                            destructive: true,
                        },
                    }] : []),
                ]}
            />

            {statusMutation.isError && (
                <p role="alert" className="mx-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    Не удалось обновить заказ: {statusMutation.error.message}
                </p>
            )}

            <main className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-start gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5">
                <OrderTimeline
                    className="lg:col-span-2"
                    steps={ORDER_STEPS}
                    currentStep={step}
                    timestamps={timestamps}
                    cancelled={cancelled}
                />
                <div className="min-w-0 space-y-4">
                    <OrderItemsCard
                        items={order.items}
                        itemsTotal={itemsTotal}
                        deliveryPrice={order.deliveryPrice}
                        orderTotal={orderTotal}
                    />
                    <DeliveryCard delivery={order.delivery} />
                </div>
                <aside className="min-w-0 space-y-4">
                    <CustomerPaymentCard customer={order.customer} payment={order.payment} />
                    <NotesSection note={note} onNoteChange={setNote} />
                    {order.comment && <p className="rounded-xl bg-white p-4 text-sm text-muted-foreground">Комментарий покупателя: {order.comment}</p>}
                </aside>
            </main>
        </div>
    );
}
