import {Button} from "@/components/ui/button.jsx"

export function TablePagination({table, dataLength}) {
    const pagination = table.state.pagination ?? {pageIndex: 0, pageSize: 8}
    const pageIndex = pagination.pageIndex ?? 0
    const pageSize = pagination.pageSize ?? 8

    const filteredLength = table.getFilteredRowModel().rows.length
    const rowsOnPage = table.getRowModel().rows.length
    const totalDataLength = dataLength ?? filteredLength
    const pageCount = table.getPageCount()

    const firstShown = filteredLength === 0 ? 0 : pageIndex * pageSize + 1
    const lastShown =
        filteredLength === 0
            ? 0
            : Math.min(pageIndex * pageSize + rowsOnPage, filteredLength)

    return (
        <div
            className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E5EA] bg-white px-4 py-3 dark:border-[#38383A] dark:bg-[#1C1C1E]">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#6E6E73] dark:text-[#AEAEB2]">
                <span className="tabular-nums">
                    Показано{" "}
                    <span className="font-semibold text-[#1C1C1E] dark:text-white">
                        {firstShown}–{lastShown}
                    </span>{" "}
                    из{" "}
                    <span className="font-semibold text-[#1C1C1E] dark:text-white">
                        {filteredLength}
                    </span>
                    {filteredLength !== totalDataLength && (
                        <span> · всего {totalDataLength}</span>
                    )}
                </span>

                <span className="tabular-nums">
                    Страница {pageCount === 0 ? 0 : pageIndex + 1} из {pageCount}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="h-9 rounded-full border-black/[0.08] bg-white px-4 text-[#007AFF] shadow-sm transition-all hover:bg-[#F2F2F7] active:scale-[0.98] dark:border-white/[0.1] dark:bg-[#2C2C2E] dark:text-[#0A84FF] dark:hover:bg-[#3A3A3C]"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Назад
                </Button>

                <Button
                    variant="outline"
                    className="h-9 rounded-full border-black/[0.08] bg-white px-4 text-[#007AFF] shadow-sm transition-all hover:bg-[#F2F2F7] active:scale-[0.98] dark:border-white/[0.1] dark:bg-[#2C2C2E] dark:text-[#0A84FF] dark:hover:bg-[#3A3A3C]"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Вперёд
                </Button>
            </div>
        </div>
    )
}