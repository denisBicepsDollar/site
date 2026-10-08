import {Checkbox} from "@/components/ui/checkbox"
import {RowActionsMenu} from "@/components/ui/row-actions-menu.jsx"

import {filterFn_equalsString} from '@tanstack/react-table'

export const columns = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(checked) => {
                    row.toggleSelected(!!checked)
                }}
            />
        ),

        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Товар",
        cell: ({row}) => (
            <div className="flex items-center gap-3">
      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
        <img
            src={row.original.previewImage}
            alt={row.original.name}
            className="h-full w-full object-cover"
        />
      </span>

                <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-ink">
                        {row.original.name}
                    </div>
                    <div className="truncate text-[13px] font-medium text-ink">
                        {row.original.sku}
                    </div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Категория",
    },
    {
        accessorKey: "price",
        header: "Цена",
        cell: ({row}) => `${row.getValue("price")} ₽`,
    },
    {
        accessorKey: "stock",
        header: "Остаток",
        cell: ({row}) => `${row.getValue("stock")} шт.`,
    },
    {
        accessorKey: "variants",
        header: "Варианты",
        cell: ({row}) => {
            const variants = row.getValue("variants") || []

            return variants
                .map((variant) => `${variant.name} — ${variant.stock} шт.`)
                .join(", ")
        },
    },
    {
        accessorKey: "status",
        header: "Статус",
        filterFn: filterFn_equalsString,
    },
    {
        accessorKey: "updated",
        header: "Обновлен",
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => (
            <RowActionsMenu
                id={row.original.id}
                actions={[
                    {label: "Редактировать"},
                    {label: "Удалить", className: "text-red-600"},
                ]}
            />
        ),
    },
]
