import {RowActionsMenu} from "@/shared/ui/actions/row-actions-menu.tsx";
import {StatusBadge} from "@/shared/ui/display/status-badge.tsx";
import {filterFn_equalsString} from "@tanstack/react-table";

const ORDER_STATUS_LABELS: Record<string, string> = {
    new: "Новый",
    confirmed: "Подтверждён",
    processing: "Собирается",
    shipped: "Отправлен",
    completed: "Завершён",
    cancelled: "Отменён",
};

export const columns = [
    {
        accessorKey: "orderNumber",
        header: "Заказ",
        cell: ({row}) => (
            <div className="flex flex-col">
                <span className="truncate text-[13px] font-medium text-ink">{row.original.orderNumber}</span>
                <time className="text-[11px] text-muted-foreground" dateTime={row.original.createdAt}>
                    {new Date(row.original.createdAt).toLocaleString("ru-RU")}
                </time>
            </div>
        ),
    },
    {
        accessorKey: "customer.name",
        header: "Клиент",
        cell: ({row}) => (
            <div className="flex flex-col">
                <span className="text-[13px] font-medium text-ink">{row.original.customer.name}</span>
                <span className="text-[12px] text-muted-foreground">{row.original.customer.phone}</span>
            </div>
        ),
    },
    {
        accessorKey: "items",
        header: "Товары",
        cell: ({row}) => (
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
        accessorKey: "summary.totalPrice",
        header: "Сумма",
        cell: ({row}) => `${new Intl.NumberFormat("ru-RU").format(row.original.summary.totalPrice)} ₽`,
    },
    {
        accessorKey: "payment.status",
        header: "Оплата",
        cell: ({row}) => row.original.payment.status,
    },
    {
        accessorKey: "status",
        header: "Статус",
        filterFn: filterFn_equalsString,
        cell: ({row}) => (
            <StatusBadge tone={row.original.status === "cancelled" ? "danger" : "info"}>
                {ORDER_STATUS_LABELS[row.original.status] ?? row.original.status}
            </StatusBadge>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => <RowActionsMenu id={row.original.orderNumber} triggerClassName="hover:bg-muted" actions={[]} />,
    },
];
