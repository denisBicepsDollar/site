import {useMemo} from "react"
import {Search, Upload} from "lucide-react"
import {statusLabels} from '@/shared/components/localization.jsx'
import {Tabs, TabsList, TabsTrigger} from "@/shared/ui/layout/tabs.jsx"
import {Input} from "@/shared/ui/forms/input.jsx"
import {Button} from "@/shared/ui/actions/button.jsx"
import {Badge} from "@/shared/ui/display/badge.jsx"

// Вынесли вспомогательный компонент в этот же файл (или импортируйте его)
export function ProductSummary({table}) {
    const {totalCount, activeCount, lowStockCount} = useMemo(() => {
        if (!table) return {totalCount: 0, activeCount: 0, lowStockCount: 0};

        // Получаем все исходные данные напрямую из инстанса таблицы
        const rows = table.getCoreRowModel().rows;
        let total = 0;
        let active = 0;
        let lowStock = 0;

        rows.forEach(row => {
            const item = row.original;
            total++;
            if (item.status === "active") {
                active++;
                // Считаем товары, которые заканчиваются (склад <= 5)
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
    }, [table, table?.getCoreRowModel().rows]);

    const handleLowStockClick = () => {
        if (!table) return;

        // 1. Устанавливаем фильтр статуса на "active"
        table.getColumn("status")?.setFilterValue("active");

        // 2. Фильтруем колонку "stock" (показываем значения <= 5)
        table.getColumn("stock")?.setFilterValue([undefined, 5]);
    };

    if (totalCount === 0) return null;

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
                        onClick={handleLowStockClick}
                        className="
                            text-[#FF3B30] dark:text-[#FF453A]
                            hover:underline cursor-pointer
                            active:opacity-60 transition-all
                            font-medium text-left
                        "
                    >
                        {lowStockCount} заканчиваются
                    </button>
                </>
            )}
        </div>
    );
}

export function TableToolbar({table, statusesInfo, action}) {
    // Делаем табы управляемыми от стейта таблицы.
    // Если фильтр пустой, активен таб "all"
    const activeTab = table.getColumn("status")?.getFilterValue() || "all";

    return (
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
                {/*
                    iOS Информационный Бабл (сводка).
                    Показывается только если есть данные.
                */}
                <div className="mt-4 w-full flex justify-center sm:justify-start">
                    <ProductSummary table={table}/>
                </div>

                <Tabs
                    value={activeTab}
                    className="w-full sm:w-auto"
                    onValueChange={(value) => {
                        // При переключении табов сбрасываем фильтр "заканчиваются" по складу
                        table.getColumn("stock")?.setFilterValue(undefined);

                        table
                            .getColumn("status")
                            ?.setFilterValue(value === "all" ? undefined : value);
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

                                    data-[state=active]:bg-white
                                    data-[state=active]:text-[#1C1C1E]
                                    data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.08)]

                                    dark:data-[state=active]:bg-[#2C2C2E]
                                    dark:data-[state=active]:text-white
                                    dark:data-[state=active]:shadow-none
                                "
                            >
                                <span className="whitespace-nowrap">{statusLabels[label]}</span>

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

            {/* Правая часть: Поиск и Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* iOS-style Поисковая строка */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]"/>
                    <Input
                        placeholder="Название, артикул..."
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

                {/* Экшен кнопки */}
                <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="
                            h-11 rounded-xl gap-2 font-medium border-[#E5E5EA] dark:border-[#2C2C2E]
                            active:scale-[0.98] transition-all
                        "
                    >
                        <Upload className="h-4 w-4 text-[#007AFF]"/>
                        Экспорт
                    </Button>

                    {action && (
                        <div
                            className="h-11 [&_button]:h-full [&_button]:w-full [&_button]:rounded-xl [&_button]:active:scale-[0.98]">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}