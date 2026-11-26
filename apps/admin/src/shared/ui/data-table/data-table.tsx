import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/data-table/table.tsx"

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
    tableFeatures,
    rowPaginationFeature,
    type RowSelectionState,
} from "@tanstack/react-table"

import {useAtom, useCreateAtom, useSelector} from "@tanstack/react-store"
import {getUniqueStatuses} from "@/shared/ui/data-table/tableUtils.ts"
import {TablePagination} from "./table-pagination.tsx"
import {SelectedRowsBar} from "./selected-rows-bar.tsx"
import {TableToolbar} from "./table-toolbar.tsx"
import {cn} from "@site/ui/lib/utils";
import {useEffect, useMemo, useRef} from "react";

const features = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    columnSizingFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    rowPaginationFeature,
})

const getResponsiveColumnClass = (columnId: string) => {
    switch (columnId) {
        case "category":
            return "hidden md:table-cell";
        case "variants":
            return "hidden lg:table-cell";
        case "status":
            return "hidden sm:table-cell";
        default:
            return "";
    }
}

export function DataTable({
                              columns,
                              data,
                              action = null,
                              meta = undefined,
                              onQueryChange = undefined,
                              isFetching = false,
                              onExport = undefined,
                              isExporting = false,
                              onBulkStatusChange = undefined,
                              onBulkDelete = undefined,
                              isBulkPending = false,
                          }) {
    const isServerMode = typeof onQueryChange === "function"

    const paginationAtom = useCreateAtom({
        pageIndex: 0,
        pageSize: 8,
    });

    const [pagination, setPagination] = useAtom(paginationAtom);

    useEffect(() => {
        const handleResize = () => {
            const pageSize = window.innerHeight <= 703 ? 5 : 8;
            setPagination((prev) => prev.pageSize === pageSize ? prev : {
                ...prev,
                pageSize,
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setPagination]);

    const rowSelectionAtom = useCreateAtom<RowSelectionState>({})
    const sortingAtom = useCreateAtom([])
    const columnFiltersAtom = useCreateAtom([])
    const globalFilterAtom = useCreateAtom("")

    const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)
    const selectedIds = useMemo(
        () => Object.entries(rowSelection).filter(([, selected]) => Boolean(selected)).map(([id]) => id),
        [rowSelection],
    )
    const selectedCount = selectedIds.length

    const navigate = useNavigate()

    const sorting = useSelector(sortingAtom)
    const globalFilter = useSelector(globalFilterAtom)
    const columnFilters = useSelector(columnFiltersAtom)

    useEffect(() => {
        const validIds = new Set(data.map((row, index) => String((row as {id?: string | number}).id ?? index)));
        setRowSelection((prev) => {
            const entries = Object.entries(prev);
            if (entries.length === 0) return prev;
            let changed = false;
            const next: RowSelectionState = {};
            for (const [key, selected] of entries) {
                if (selected && validIds.has(key)) {
                    next[key] = true;
                } else if (selected) {
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, [data, setRowSelection]);

    useEffect(() => {
        if (!isServerMode || !meta) return;
        const pageCount = Math.max(1, Number(meta.pageCount || 1));
        if (pagination.pageIndex >= pageCount) {
            setPagination((prev) => ({...prev, pageIndex: pageCount - 1}));
        }
    }, [isServerMode, meta, pagination.pageIndex, setPagination]);

    const filterSig = useMemo(
        () => JSON.stringify({sorting, globalFilter, columnFilters}),
        [sorting, globalFilter, columnFilters],
    );
    const prevFilterSigRef = useRef(filterSig);

    useEffect(() => {
        const filtersChanged = prevFilterSigRef.current !== filterSig;
        if (filtersChanged) {
            prevFilterSigRef.current = filterSig;
            if (pagination.pageIndex !== 0) {
                setPagination((current) => ({...current, pageIndex: 0}));
                return;
            }
        }
        if (!onQueryChange) return;
        const timer = window.setTimeout(() => {
            const status = columnFilters.find(({id}) => id === "status")?.value ?? "all"
            onQueryChange({
                page: pagination.pageIndex,
                pageSize: pagination.pageSize,
                q: String(globalFilter ?? ""),
                status: String(status),
                lowStock: Boolean(columnFilters.find(({id}) => id === "stock")?.value),
                sortBy: sorting[0]?.id ?? "createdAt",
                sortDirection: sorting[0]?.desc ? "desc" : "asc",
            })
        }, globalFilter ? 250 : 0)
        return () => window.clearTimeout(timer)
    }, [filterSig, pagination, sorting, globalFilter, columnFilters, onQueryChange, setPagination])

    const table = useTable({
        features,
        data,
        columns,
        getRowId: (row, index) => String((row as {id?: string | number}).id ?? index),
        manualSorting: isServerMode,
        manualFiltering: isServerMode,
        manualPagination: isServerMode,
        ...(isServerMode ? {rowCount: meta?.total ?? 0} : {}),
        atoms: {
            sorting: sortingAtom,
            globalFilter: globalFilterAtom,
            columnFilters: columnFiltersAtom,
            rowSelection: rowSelectionAtom,
            pagination: paginationAtom,
        },
    })

    const statusesInfo = useMemo(() => {
        if (!meta?.statusCounts) {
            return getUniqueStatuses(table.options.data as ReadonlyArray<{status?: string | null}>)
        }
        const counts = meta.statusCounts as Record<string, number>
        const totalAll = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0)
        const baseOrder = ["active", "draft", "archived"]
        const extraStatuses = Object.keys(counts).filter((key) => !baseOrder.includes(key))
        return [
            {label: "all", count: totalAll},
            ...[...baseOrder, ...extraStatuses].map((label) => ({
                label,
                count: Number(counts[label] ?? 0),
            })),
        ]
    }, [meta, table.options.data])

    const activeRows = table.getRowModel().rows
    const emptyRowsCount = Math.max(0, pagination.pageSize - activeRows.length)
    const totalPaginationCount = isServerMode
        ? (meta?.total ?? 0)
        : table.getFilteredRowModel().rows.length

    return (
        <div className="space-y-4 w-full max-w-full overflow-hidden" aria-busy={isFetching}>
            <TableToolbar
                table={table}
                statusesInfo={statusesInfo}
                action={action}
                meta={meta}
                onExport={onExport}
                isExporting={isExporting}
            />

            <div className="
                flex flex-col overflow-hidden rounded-[18px]
                border border-black/[0.06] bg-[#F2F2F7]
                shadow-[0_4px_16px_rgba(0,0,0,0.04)]
                dark:border-white/[0.06] dark:bg-[#1C1C1E] dark:shadow-none
            ">
                <div className="w-full overflow-x-auto scrollbar-none touch-pan-x [-webkit-overflow-scrolling:touch]">
                    <div className="w-full min-w-[340px] bg-white dark:bg-[#1C1C1E]">
                        <Table className="">
                            <TableHeader className="">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow className="" key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const colId = header.column.id;
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{width: header.column.getSize()}}
                                                    className={cn(
                                                        header.column.id === "select" ? "px-0" : "font-medium",
                                                        getResponsiveColumnClass(colId)
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "flex items-center",
                                                            header.column.id === "select"
                                                                ? "justify-center"
                                                                : cn(
                                                                    "gap-1 rounded-md px-2 justify-between py-1 transition-colors duration-150",
                                                                    header.column.getCanSort() && "cursor-pointer hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/10",
                                                                )
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

                            <TableBody className="">
                                {activeRows.length > 0 ? (
                                    <>
                                        {activeRows.map((row) => (
                                            <TableRow
                                                onClick={() => navigate(`${(row.original as {id: string | number}).id}`)}
                                                key={row.id}
                                                className="cursor-pointer active:bg-black/[0.02] dark:active:bg-white/[0.02]"
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
                                                                getResponsiveColumnClass(colId)
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
                                                                getResponsiveColumnClass(colId)
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
                                    <TableRow className="">
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
                                    <TablePagination table={table} dataLength={totalPaginationCount}/>
                                </td>
                            </tr>
                            </tfoot>
                        </Table>
                    </div>
                </div>
            </div>

            <SelectedRowsBar
                count={selectedCount}
                selectedIds={selectedIds}
                statusesInfo={statusesInfo}
                onClear={() => table.setRowSelection({})}
                onBulkStatusChange={onBulkStatusChange}
                onBulkDelete={onBulkDelete}
                isPending={isBulkPending}
            />
        </div>
    )
}
