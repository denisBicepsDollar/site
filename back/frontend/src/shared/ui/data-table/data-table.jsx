import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/data-table/table.jsx"

import {useNavigate} from "react-router-dom"
import {ArrowUp} from 'lucide-react'
import {
    useTable,
    flexRender,
    columnSizingFeature,
    rowSelectionFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    rowSortingFeature,
    createSortedRowModel,
    createFilteredRowModel,
    createPaginatedRowModel,
    tableFeatures,
    rowPaginationFeature,
} from "@tanstack/react-table"

import {useAtom, useCreateAtom, useSelector} from "@tanstack/react-store"
import {getUniqueStatuses} from "@/shared/ui/data-table/tableUtils.js"
import {TablePagination} from "./table-pagination.jsx"
import {SelectedRowsBar} from "./selected-rows-bar.jsx"
import {TableToolbar} from "./table-toolbar.jsx"
import {cn} from "@/shared/lib/utils.js";
import {useEffect} from "react";

const features = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    columnSizingFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    rowPaginationFeature,
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
})

// Хелпер для адаптивного скрытия колонок на мобильных устройствах
const getResponsiveColumnClass = (columnId) => {
    switch (columnId) {
        case "category":
            return "hidden md:table-cell"; // Скрываем на мобилках и планшетах
        case "variants":
            return "hidden lg:table-cell"; // Варианты оставляем только на больших экранах
        case "status":
            return "hidden sm:table-cell"; // Скрываем статус на экранах меньше 640px (iPhone)
        default:
            return ""; // Остальные колонки (Товар, Цена, Склад, Чекбокс, Действия) всегда видны
    }
}

export function DataTable({columns, data, action}) {

    const paginationAtom = useCreateAtom({
        pageIndex: 0,
        pageSize: 8,
    });

    const [pagination, setPagination] = useAtom(paginationAtom);

    useEffect(() => {
        const handleResize = () => {
            let pageSize = 8;
            if (window.innerHeight <= 703) {
                pageSize = 5;
            } else {
                pageSize = 8;
            }

            setPagination((prev) => ({
                ...prev,
                pageSize,
            }));
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setPagination]);

    const rowSelectionAtom = useCreateAtom({})
    const sortingAtom = useCreateAtom([])
    const columnFiltersAtom = useCreateAtom([])
    const globalFilterAtom = useCreateAtom("")

    const rowSelection = useSelector(rowSelectionAtom)
    const selectedCount = Object.values(rowSelection).filter(Boolean).length

    const navigate = useNavigate()

    const table = useTable({
        features,
        data,
        columns,
        debugTable: true,
        atoms: {
            sorting: sortingAtom,
            globalFilter: globalFilterAtom,
            columnFilters: columnFiltersAtom,
            rowSelection: rowSelectionAtom,
            pagination: paginationAtom,
        },
    })

    const statusesInfo = getUniqueStatuses(table.options.data)

    // Вычисляем количество пустых строк для рендера
    const activeRows = table.getRowModel().rows
    const emptyRowsCount = Math.max(0, pagination.pageSize - activeRows.length)

    return (
        <div className="space-y-4 w-full max-w-full overflow-hidden">
            <TableToolbar table={table} statusesInfo={statusesInfo} action={action}/>

            <div className="
                flex flex-col overflow-hidden rounded-[18px]
                border border-black/[0.06] bg-[#F2F2F7]
                shadow-[0_4px_16px_rgba(0,0,0,0.04)]
                dark:border-white/[0.06] dark:bg-[#1C1C1E] dark:shadow-none
            ">
                {/*
                  Контейнер с поддержкой горизонтальной прокрутки на очень маленьких iPhone.
                  no-scrollbar скрывает системный скроллбар для нативного вида.
                */}
                <div className="w-full overflow-x-auto scrollbar-none touch-pan-x [-webkit-overflow-scrolling:touch]">
                    <div className="w-full min-w-[340px] bg-white dark:bg-[#1C1C1E]">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const colId = header.column.id;
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{width: header.column.getSize()}}
                                                    className={cn(
                                                        header.column.id === "select" ? "px-0" : "font-medium",
                                                        getResponsiveColumnClass(colId) // Применяем адаптивные классы
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "flex items-center",
                                                            header.column.id === "select"
                                                                ? "justify-center"
                                                                : "cursor-pointer gap-1 rounded-md px-2 justify-between py-1 transition-colors duration-150 hover:bg-black/5 active:bg-black/10"
                                                        )}
                                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                                    >
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

                                                        {header.column.getCanSort() && (
                                                            <ArrowUp
                                                                className={cn(
                                                                    "h-4 w-4 opacity-0 transition-all duration-200 shrink-0",
                                                                    header.column.getIsSorted() === "asc" && "opacity-100",
                                                                    header.column.getIsSorted() === "desc" && "rotate-180 opacity-100",
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {activeRows.length > 0 ? (
                                    <>
                                        {/* Реальные товары */}
                                        {activeRows.map((row) => (
                                            <TableRow
                                                onClick={() => navigate(`${row.id}`)}
                                                key={row.id}
                                                className="cursor-pointer active:bg-black/[0.02] dark:active:bg-white/[0.02]" // Эффект тапа на iOS
                                                data-state={row.getIsSelected() ? "selected" : undefined}
                                            >
                                                {row.getAllCells().map((cell) => {
                                                    const colId = cell.column.id;
                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            style={{width: cell.column.getSize()}}
                                                            className={cn(
                                                                cell.column.id === "select" ? "px-0" : undefined,
                                                                getResponsiveColumnClass(colId) // Скрываем ячейки на мобилке в такт шапке
                                                            )}
                                                        >
                                                            <div
                                                                className={cell.column.id === "select" || cell.column.id === "stock" ? "flex justify-center" : undefined}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        ))}

                                        {/* Строки-заглушки (Placeholders) */}
                                        {Array.from({length: emptyRowsCount}).map((_, index) => (
                                            <TableRow
                                                key={`empty-row-${index}`}
                                                className="hover:bg-transparent border-b-transparent last:border-b-0 cursor-default pointer-events-none select-none"
                                            >
                                                {columns.map((column, colIndex) => {
                                                    const colId = column.id || column.accessorKey;
                                                    return (
                                                        <TableCell
                                                            key={`empty-cell-${colIndex}`}
                                                            style={{width: column.size}}
                                                            className={cn(
                                                                "h-[72.8px] py-0",
                                                                getResponsiveColumnClass(colId) // Заглушки тоже должны скрывать колонки!
                                                            )}
                                                        >
                                                            <div className="opacity-0">&nbsp;</div>
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    /* Если фильтр вообще ничего не выдал */
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            style={{height: `${pagination.pageSize * 72.8}px`}}
                                            className="text-center text-[13px] leading-6 text-[#8E8E93]"
                                        >
                                            Ничего не найдено
                                            <br/>
                                            Попробуйте изменить запрос или фильтры
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <tfoot>
                            <tr>
                                <td colSpan={columns.length} className="p-0">
                                    <TablePagination table={table} dataLength={data.length}/>
                                </td>
                            </tr>
                            </tfoot>
                        </Table>
                    </div>
                </div>
            </div>

            <SelectedRowsBar
                count={selectedCount}
                statusesInfo={statusesInfo}
                onClear={() => table.setRowSelection({})}
            />
        </div>
    )
}