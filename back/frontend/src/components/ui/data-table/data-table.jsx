import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/data-table/table.jsx"

import {useNavigate} from "react-router-dom"


import {
    useTable,
    flexRender,
    rowSelectionFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    tableFeatures,
    rowPaginationFeature,
} from "@tanstack/react-table"

import {useCreateAtom, useSelector} from "@tanstack/react-store"
import {getUniqueStatuses} from "@/components/ui/data-table/tableUtils.js"
import {TablePagination} from "./table-pagination.jsx"
import {SelectedRowsBar} from "./selected-rows-bar.jsx"
import {TableToolbar} from "./table-toolbar.jsx"

const features = tableFeatures({
    rowSelectionFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    rowPaginationFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
})

export function DataTable({columns, data}) {
    const rowSelectionAtom = useCreateAtom({})
    const rowSelection = useSelector(rowSelectionAtom)
    const selectedCount = Object.values(rowSelection).filter(Boolean).length

    const columnFiltersAtom = useCreateAtom([])
    const globalFilterAtom = useCreateAtom("")
    const paginationAtom = useCreateAtom({
        pageIndex: 0,
        pageSize: 8,
    })

    const navigate = useNavigate()


    const table = useTable({
        features,
        data,
        columns,
        debugTable: true,
        atoms: {
            globalFilter: globalFilterAtom,
            columnFilters: columnFiltersAtom,
            rowSelection: rowSelectionAtom,
            pagination: paginationAtom,
        },
    })

    const uniqueStatuses = getUniqueStatuses(table.options.data)

    return (
        <div className="space-y-4">
            <TableToolbar table={table} uniqueStatuses={uniqueStatuses}/>

            <div
                className="flex flex-col overflow-hidden rounded-[18px] border border-black/[0.06] bg-[#F2F2F7] shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-[#1C1C1E] dark:shadow-none">
                <div className="flex w-full flex-col gap-px">
                    <div className="w-full bg-white dark:bg-[#1C1C1E]">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="font-medium"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            onClick={() => navigate(`${row.id}`)}
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected()
                                                    ? "selected"
                                                    : undefined
                                            }
                                        >
                                            {row.getAllCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-28 text-center text-[13px] leading-6 text-[#8E8E93]"
                                        >
                                            Ничего не найдено
                                            <br/>
                                            Попробуйте изменить запрос или фильтры
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <TablePagination table={table} dataLength={data.length}/>
                </div>
            </div>

            <SelectedRowsBar
                count={selectedCount}
                statuses={uniqueStatuses}
                onClear={() => table.setRowSelection({})}
            />
        </div>
    )
}