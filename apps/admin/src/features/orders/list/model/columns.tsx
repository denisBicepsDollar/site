import {RowActionsMenu} from "@/shared/ui/actions/row-actions-menu.tsx";
import {StatusBadge, type StatusTone} from "@/shared/ui/display/status-badge.tsx";
import type {AdminOrder} from "@/shared/api/orders/ordersApi.ts";
import {filterFn_equalsString} from "@tanstack/react-table";

const ORDER_STATUS_LABELS: Record<string, string> = {
    new: "Новый",
    confirmed: "Подтверждён",
    processing: "Собирается",
    shipped: "Отправлен",
    completed: "Завершён",
    cancelled: "Отменён",
};

function getOrderStatusTone(status: string): StatusTone {
    if (status === "cancelled") return "danger";
    if (status === "completed") return "success";
    return "info";
}

export const columns = [
    {
        id: "orderNumber",
        accessorFn: (row: AdminOrder) => row.orderNumber,
        sortingFn: (rowA: {original: AdminOrder}, rowB: {original: AdminOrder}) =>
            rowA.original.id - rowB.original.id,
        header: "Заказ",
        cell: ({row}: {row: {original: AdminOrder}}) => (
            <div className="flex flex-col">
                <span className="truncate text-[13px] font-medium text-ink">{row.original.orderNumber}</span>
                <time className="text-[11px] text-muted-foreground" dateTime={row.original.createdAt}>
                    {new Date(row.original.createdAt).toLocaleString("ru-RU")}
                </time>
            </div>
        ),
    },
    {
        id: "customer",
        accessorFn: (row: AdminOrder) =>
            [row.customer.name, row.customer.phone, row.customer.email].filter(Boolean).join(" "),
        header: "Клиент",
        cell: ({row}: {row: {original: AdminOrder}}) => (
            <div className="flex flex-col">
                <span className="text-[13px] font-medium text-ink">{row.original.customer.name}</span>
                <span className="text-[12px] text-muted-foreground">{row.original.customer.phone}</span>
            </div>
        ),
    },
    {
        id: "items",
        accessorFn: (row: AdminOrder) => row.items.map((item) => item.title).join(" "),
        header: "Товары",
        enableSorting: false,
        cell: ({row}: {row: {original: AdminOrder}}) => (
            <div className="flex flex-col gap-1">
                {row.original.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-[13px]">
                        <span className="max-w-[150px] truncate font-medium text-ink">{item.title}</span>
                        <span className="text-[11px] text-muted-foreground">({item.quantity} шт.)</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "totalPrice",
        accessorFn: (row: AdminOrder) => row.summary.totalPrice,
        header: "Сумма",
        cell: ({row}: {row: {original: AdminOrder}}) =>
            `${new Intl.NumberFormat("ru-RU").format(row.original.summary.totalPrice)} ₽`,
    },
    {
        id: "paymentStatus",
        accessorFn: (row: AdminOrder) => row.payment.status,
        header: "Оплата",
        cell: ({row}: {row: {original: AdminOrder}}) => row.original.payment.status,
    },
    {
        accessorKey: "status",
        header: "Статус",
        filterFn: filterFn_equalsString,
        cell: ({row}: {row: {original: AdminOrder}}) => (
            <StatusBadge tone={getOrderStatusTone(row.original.status)}>
                {ORDER_STATUS_LABELS[row.original.status] ?? row.original.status}
            </StatusBadge>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}: {row: {original: AdminOrder}}) => (
            <RowActionsMenu id={row.original.id} triggerClassName="hover:bg-muted" actions={[]} />
        ),
    },
];
