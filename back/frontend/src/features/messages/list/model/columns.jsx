import {Checkbox} from "@/shared/ui/forms/checkbox.jsx"
import {Button} from "@/shared/ui/actions/button.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/actions/dropdown-menu.jsx"
import {MoreHorizontal} from "lucide-react"

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
        cell: ({row}) => {
            const item = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
                            Копировать ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-red-600">
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
