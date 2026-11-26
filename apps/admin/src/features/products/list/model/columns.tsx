import {Checkbox} from "@site/ui/checkbox"
import {RowActionsMenu} from "@/shared/ui/actions/row-actions-menu.tsx"
import {statusLabels} from '@/shared/components/localization.ts'

import {filterFn_equalsString, filterFn_inNumberRange} from '@tanstack/react-table'

export function createProductColumns({onDeleteProduct}: {onDeleteProduct?: (product: any) => void} = {}) {
    return [
        {
            id: "select",
            size: 36,
            header: ({table}) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected()}
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
                        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F2F2F7]">
                            <img
                                src={row.original.previewImage || "/default-image.png"}
                                alt={String(name)}
                                onError={(e) => {
                                    if (!e.currentTarget.src.endsWith("/default-image.png")) {
                                        e.currentTarget.src = "/default-image.png";
                                    }
                                }}
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
                <span className="text-base text-zinc-500">
                    {row.getValue("category") || "Без категории"}
                </span>
            )
        },
        {
            accessorKey: "price",
            header: "Цена",
            size: 80,
            cell: ({row}) => (
                <span className="text-base font-medium">
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
                        <span
                            className="text-[13px] font-semibold leading-none tabular-nums whitespace-nowrap">
                            {stock} шт.
                        </span>

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
            enableSorting: false,
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
                const hiddenVariantsCount = variants.length - visible.length;

                const stockColor = (stock: number) =>
                    stock === 0
                        ? "text-[#D70015]"
                        : stock <= 5
                            ? "text-[#C93400]"
                            : "text-[#248A3D]";

                return (
                    <span
                        className="flex h-12 w-[204px] shrink-0 flex-wrap content-center items-center gap-1 overflow-hidden"
                        title={variants.map((v: any) => `${v.name || "Стандарт"} — ${v.stock} шт.`).join(", ")}
                    >
                        {visible.map((v: any, idx: number) => (
                            <span
                                key={v.id ?? `${v.name}-${idx}`}
                                className="inline-flex h-6 max-w-[150px] shrink-0 items-center gap-1.5 rounded-full bg-[#787880]/10 px-2.5 leading-none text-[#3A3A3C] dark:text-[#F2F2F7]"
                            >
                                <span className="truncate text-sm font-medium">{v.name || "Стандарт"}</span>
                                <span className={`shrink-0 text-sm font-semibold tabular-nums ${stockColor(v.stock)}`}>
                                    {v.stock}
                                </span>
                            </span>
                        ))}
                        {hiddenVariantsCount > 0 && (
                            <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#787880]/10 px-2 text-xs font-semibold text-[#6E6E73] dark:text-[#AEAEB2]">
                                +{hiddenVariantsCount}
                            </span>
                        )}
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

                const statusStyles: Record<string, {bg: string; text: string}> = {
                    active: {bg: "bg-[#34C759]/10", text: "text-[#248A3D]"},
                    draft: {bg: "bg-[#787880]/10", text: "text-[#6C6C70]"},
                    hidden: {bg: "bg-[#FF9500]/10", text: "text-[#C93400]"},
                    archived: {bg: "bg-[#FF3B30]/10", text: "text-[#D70015]"},
                };

                const style = statusStyles[String(status)] ?? {bg: "bg-[#787880]/10", text: "text-[#6C6C70]"};

                return (
                    <span
                        className={`inline-flex h-6 w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-full px-2 leading-none ${style.bg} ${style.text}`}
                    >
                        <span className="truncate text-sm font-semibold">
                            {statusLabels[String(status)] ?? String(status)}
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
                        triggerClassName=""
                        actions={onDeleteProduct ? [
                            {
                                label: "Удалить",
                                className: "text-[#FF3B30] focus:text-[#D70015]",
                                onClick: () => onDeleteProduct(row.original),
                            },
                        ] : []}
                    />
                </div>
            ),
        },
    ]
}

export const columns = createProductColumns();
