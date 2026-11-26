import {useMemo} from "react"
import {Search, Upload} from "lucide-react"
import {statusLabels} from '@/shared/components/localization.ts'
import {Tabs, TabsList, TabsTrigger} from "@/shared/ui/layout/tabs.tsx"
import {Input} from "@site/ui/input"
import {Button} from "@site/ui/button"
import {Badge} from "@site/ui/badge"

function getOptionalColumn(table, columnId: string) {
    if (!table) return undefined;
    const exists = table.getAllLeafColumns?.().some((col) => col.id === columnId);
    return exists ? table.getColumn(columnId) : undefined;
}

export function ProductSummary({table, meta = undefined}) {
    const stockColumn = getOptionalColumn(table, "stock");
    const isLowStockActive = Boolean(stockColumn?.getFilterValue());
    const rows = table?.getCoreRowModel().rows;

    const {totalCount, activeCount, lowStockCount} = useMemo(() => {
        if (!table || !stockColumn) {
            return {totalCount: 0, activeCount: 0, lowStockCount: 0};
        }

        if (meta?.statusCounts) {
            const counts = meta.statusCounts as Record<string, number>;
            const total = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
            return {
                totalCount: total,
                activeCount: Number(counts.active ?? 0),
                lowStockCount: Number(meta.lowStockCount ?? 0),
            };
        }

        let total = 0;
        let active = 0;
        let lowStock = 0;

        (rows ?? []).forEach(row => {
            const item = row.original;
            total++;
            if (item.status === "active") {
                active++;
                if (Number(item.stock) <= 5) {
                    lowStock++;
                }
            }
        });

        return {
            totalCount: total,
            activeCount: active,
            lowStockCount: lowStock,
        };
    }, [table, stockColumn, meta, rows]);

    const handleLowStockClick = () => {
        if (!table || !stockColumn) return;

        if (isLowStockActive) {
            stockColumn.setFilterValue(undefined);
            return;
        }

        table.getColumn("status")?.setFilterValue("active");
        stockColumn.setFilterValue([undefined, 5]);
    };

    if (!stockColumn || totalCount === 0) return null;

    return (
        <div
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.05] bg-white/75 px-4 py-1.5 text-[13px] text-[#6E6E73] shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.08] dark:text-[#AEAEB2]">
            <span>{totalCount} позиций</span>

            {activeCount > 0 && (
                <>
                    <span className="text-[#E5E5EA] dark:text-[#3A3A3C]">•</span>
                    <span>{activeCount} активных</span>
                </>
            )}

            {lowStockCount > 0 && (
                <>
                    <span className="text-[#E5E5EA] dark:text-[#3A3A3C]">•</span>
                    <button
                        type="button"
                        onClick={handleLowStockClick}
                        className={`
                            text-[#FF3B30] dark:text-[#FF453A]
                            hover:underline cursor-pointer
                            active:opacity-60 transition-all
                            font-medium text-left
                            ${isLowStockActive ? "underline font-semibold" : ""}
                        `}
                    >
                        {lowStockCount} заканчиваются
                    </button>
                </>
            )}
        </div>
    );
}

export function TableToolbar({table, statusesInfo, action, meta = undefined, onExport = undefined, isExporting = false}) {
    const activeTab = getOptionalColumn(table, "status")?.getFilterValue() || "all";
    const searchValue = String(table.state?.globalFilter ?? "");

    return (
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
                <div className="mt-4 w-full flex justify-center sm:justify-start">
                    <ProductSummary table={table} meta={meta}/>
                </div>

                <Tabs
                    value={activeTab}
                    className="w-full sm:w-auto"
                    onValueChange={(value) => {
                        getOptionalColumn(table, "stock")?.setFilterValue(undefined);
                        getOptionalColumn(table, "status")?.setFilterValue(
                            value === "all" ? undefined : value,
                        );
                    }}
                >
                    <TabsList className="
                        flex w-full sm:w-max justify-start gap-1 p-1
                        overflow-x-auto select-none touch-pan-x
                        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                        bg-[#F2F2F7] dark:bg-[#1C1C1E]
                        rounded-[13px] h-11
                    ">
                        {statusesInfo.map(({label, count}) => (
                            <TabsTrigger
                                key={label}
                                value={label}
                                className="
                                    flex items-center gap-1.5 h-9 px-4 rounded-[10px] cursor-pointer
                                    text-[13px] font-medium text-[#6E6E73] dark:text-[#98989D]
                                    transition-all duration-200
                                    active:scale-[0.97]

                                    data-active:bg-white
                                    data-active:text-[#1C1C1E]
                                    data-active:shadow-[0_2px_8px_rgba(0,0,0,0.08)]

                                    dark:data-active:bg-[#2C2C2E]
                                    dark:data-active:text-white
                                    dark:data-active:shadow-none
                                "
                            >
                                <span className="whitespace-nowrap">{statusLabels[label] ?? label}</span>

                                <Badge
                                    variant="secondary"
                                    className="
                                        h-5 min-w-5 px-1 rounded-full text-[11px] font-semibold
                                        bg-[#E5E5EA] text-[#8E8E93]
                                        dark:bg-[#3A3A3C] dark:text-[#8E8E93]
                                    "
                                >
                                    {count}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]"/>
                    <Input
                        value={searchValue}
                        placeholder="Поиск..."
                        className="
                            pl-10 h-11 rounded-xl
                            bg-[#E5E5EA]/50 dark:bg-[#2C2C2E]/50
                            border-none
                            placeholder:text-[#8E8E93]
                            focus-visible:ring-2 focus-visible:ring-[#007AFF]/30
                            transition-all
                        "
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                    />
                </div>

                {(onExport || action) && (
                    <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                        {onExport && (
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isExporting}
                                onClick={() => onExport(table.getFilteredRowModel().rows.map(r => r.original))}
                                className="
                                    h-11 rounded-xl gap-2 font-medium border-[#E5E5EA] dark:border-[#2C2C2E]
                                    active:scale-[0.98] transition-all
                                "
                            >
                                <Upload className="h-4 w-4 text-[#007AFF]"/>
                                {isExporting ? "Экспорт..." : "Экспорт"}
                            </Button>
                        )}

                        {action && (
                            <div
                                className="h-11 [&_button]:h-full [&_button]:w-full [&_button]:rounded-xl [&_button]:active:scale-[0.98]">
                                {action}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
