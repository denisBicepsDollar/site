import {RowActionsMenu} from "@/shared/ui/actions/row-actions-menu.jsx"

import {filterFn_equalsString} from '@tanstack/react-table'

export const columns = [
    {
        accessorKey: "id",
        header: "Заказ",
        cell: ({row}) => (
            <div className="flex items-center gap-3">
                <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-ink">
                        {row.original.id}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                        {/* Форматируем дату, если нужно, или оставляем строку */}
                        {row.original.createdAt}
                    </div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "customer",
        header: "Клиент",
        // ИСПРАВЛЕНО: Достаем customer из row.original
        cell: ({row}) => {
            const customer = row.original.customer;
            return (
                <div className="flex items-center gap-3">
                    <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-ink">
                            {customer?.firstName} {customer?.lastName} {/* Согласовано со структурой */}
                        </div>
                        <div className="truncate text-[12px] text-muted-foreground">
                            {customer?.phone}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "items",
        header: "Товары",
        // ИСПРАВЛЕНО: Достаем items из row.original и добавили key в map
        cell: ({row}) => {
            const items = row.original.items || [];
            return (
                <div className="flex flex-col gap-1">
                    {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-2 text-[13px]">
                            <span className="font-medium text-ink truncate max-w-[150px]">
                                {item.title}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                                ({item.quantity} шт.)
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
    },
    {
        accessorKey: "price",
        header: "Сумма",
        // ИСПРАВЛЕНО: Достаем summary из row.original (в структуре было totalPrice)
        cell: ({row}) => `${row.original.summary?.totalPrice} ₽`,
    },
    {
        accessorKey: "payment",
        header: "Оплата",
        // ИСПРАВЛЕНО: В структуре payment — это объект, выводим конкретное поле или статус оплаты
        cell: ({row}) => row.original.payment?.isPaid ? "Оплачено" : "Не оплачено",
    },
    {
        accessorKey: "status",
        header: "Статус",
        filterFn: filterFn_equalsString,
        // Рекомендуется добавить кастомный cell для красивого отображения статуса
        cell: ({row}) => (
            <span className={`status-${row.original.status}`}>
                {row.original.status}
            </span>
        )
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => (
            <RowActionsMenu
                id={row.original.id}
                triggerClassName="hover:bg-muted"
                actions={[
                    {label: "Удалить", className: "text-red-600"},
                ]}
            />
        ),
    },
]
