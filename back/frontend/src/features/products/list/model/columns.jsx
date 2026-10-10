import {Checkbox} from "@/shared/ui/forms/checkbox.jsx"
import {RowActionsMenu} from "@/shared/ui/actions/row-actions-menu.jsx"
import {statusLabels} from '@/shared/components/localization.jsx'

import {filterFn_equalsString, sortFn_datetime, filterFn_inNumberRange} from '@tanstack/react-table'

export const columns = [
    {
        id: "select",
        size: 36,
        header: ({table}) => (
            <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    isIndeterminate={table.getIsSomePageRowsSelected()}
                    onCheckedChange={() => table.toggleAllPageRowsSelected()}
                />
            </div>
        ),
        cell: ({row}) => (
            <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onCheckedChange={(checked) => {
                        row.toggleSelected(!!checked)
                    }}
                />
            </div>
        ),

        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: () => "Товар",
        size: 260,
        cell: ({row}) => {
            const name = row.getValue("name")

            return (
                <div className="flex items-center gap-3">
      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
        <img
            src={row.original.previewImage}
            alt={String(name)}
            className="h-full w-full object-cover"
        />
      </span>

                    <div className="min-w-0">
                        <div className="truncate text-base font-medium text-zinc">
                            {name}
                        </div>
                        {row.original.sku && (
                            <div className="truncate text-sm font-mono text-zinc-500">
                                {row.original.sku}
                            </div>
                        )}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "category",
        size: 120,
        header: "Категория",
        cell: ({row}) => (
            <span className=" text-base text-zinc-500">
                {row.getValue("category")}
            </span>
        )
    },
    {
        accessorKey: "price",
        header: "Цена",
        size: 80,
        cell: ({row}) => (
            <span className=" text-base font-medium">
                {row.getValue("price")} ₽
            </span>
        )
    },
    {
        accessorKey: "stock",
        header: "Остаток",
        size: 120,
        filterFn: filterFn_inNumberRange,
        cell: ({row}) => {
            const stock = Number(row.getValue("stock"));

            // iOS system colors: red #FF3B30, orange #FF9500, green #34C759
            const state =
                stock === 0
                    ? {
                        bg: "bg-[#FF3B30]/10",
                        text: "text-[#FF3B30]",
                        dot: "bg-[#FF3B30]",
                        label: "Нет в наличии",
                    }
                    : stock <= 5
                        ? {
                            bg: "bg-[#FF9500]/10",
                            text: "text-[#FF9500]",
                            dot: "bg-[#FF9500]",
                            label: "Заканчивается",
                        }
                        : {
                            bg: "bg-[#34C759]/10",
                            text: "text-[#34C759]",
                            dot: "bg-[#34C759]",
                            label: "В наличии",
                        };

            return (
                <span
                    className={`inline-flex h-12 w-[108px] shrink-0 flex-col items-center justify-center gap-[3px] overflow-hidden rounded-[14px] ${state.bg} ${state.text}`}
                >
                {/* строка 1: количество — всегда одна высота и кегль */}
                    <span
                        className="text-[13px] font-semibold leading-none tracking-tight tabular-nums whitespace-nowrap">
                    {stock} шт.
                </span>

                    {/* строка 2: точка + статус */}
                    <span className="flex items-center gap-1 leading-none">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${state.dot}`}/>
                    <span className="max-w-[88px] truncate text-[10px] font-medium leading-none">
                        {state.label}
                    </span>
                </span>
            </span>
            );
        },
    },

    {
        accessorKey: "variants",
        header: "Варианты",
        size: 150,
        cell: ({row}) => {
            const variants = row.getValue("variants") || [];

            if (variants.length === 0) {
                return (
                    <span
                        className="inline-flex h-6 items-center rounded-full bg-[#787880]/10 px-2.5 text-xs font-medium leading-none text-[#8E8E93]">
                    Нет вариантов
                </span>
                );
            }

            const MAX_VISIBLE = 2;
            const visible = variants.slice(0, MAX_VISIBLE);
            const hidden = variants.length - visible.length;

            // цвет точки — по остатку, та же шкала, что в колонке «Остаток»
            const stockColor = (stock) =>
                stock === 0
                    ? "text-[#D70015]"
                    : stock <= 5
                        ? "text-[#C93400]"
                        : "text-[#248A3D]";

            return (
                <span
                    className="flex h-12 w-[204px] shrink-0 flex-wrap content-center items-center gap-1 overflow-hidden"
                    title={variants.map((v) => `${v.name} — ${v.stock} шт.`).join(", ")}
                >
                {visible.map((v) => (
                    <span
                        key={v.name}
                        className="inline-flex h-6 max-w-[150px] shrink-0 items-center gap-1.5 rounded-full bg-[#787880]/10 px-2.5 leading-none text-[#3A3A3C]"
                    >
                        <span className="truncate text-sm font-medium">{v.name}</span>
                        <span className={`shrink-0 text-sm font-semibold tabular-nums ${stockColor(v.stock)}`}>
                            {v.stock}
                        </span>
                    </span>
                ))}
                </span>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Статус",
        size: 110,
        cell: ({row}) => {
            const status = row.getValue("status");

            // палитра iOS: tinted-подложка (цвет/10%) + accessible-цвет текста
            const statusStyles = {
                active: {bg: "bg-[#34C759]/10", text: "text-[#248A3D]"}, // активен
                draft: {bg: "bg-[#787880]/10", text: "text-[#6C6C70]"}, // черновик
                hidden: {bg: "bg-[#FF9500]/10", text: "text-[#C93400]"}, // скрыт
                archived: {bg: "bg-[#FF3B30]/10", text: "text-[#D70015]"}, // в архиве
            };

            // запасной нейтральный стиль для неизвестных статусов
            const style = statusStyles[status] ?? {bg: "bg-[#787880]/10", text: "text-[#6C6C70]"};

            return (
                <span
                    className={`inline-flex h-6 w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-full px-2 leading-none ${style.bg} ${style.text}`}
                >
                <span className="truncate text-sm font-semibold">
                    {statusLabels[status] ?? status}
                </span>
            </span>
            );
        },
        filterFn: filterFn_equalsString,
    },

    {
        id: "actions",
        enableHiding: false,
        size: 64,
        cell: ({row}) => (
            <div onClick={(e) => e.stopPropagation()}>
                <RowActionsMenu
                    id={row.original.id}
                    actions={[
                        {label: "Удалить", className: "text-red-600"},
                    ]}
                />
            </div>
        ),
    },
]
