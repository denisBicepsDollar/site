import {Button} from "@site/ui/button"

export function TablePagination({table, dataLength}) {
    const pagination = table.state.pagination ?? {pageIndex: 0, pageSize: 8}
    const pageIndex = pagination.pageIndex ?? 0
    const pageSize = pagination.pageSize ?? 8

    const totalDataLength = dataLength ?? table.getRowModel().rows.length
    const rowsOnPage = table.getRowModel().rows.length
    const pageCount = table.getPageCount()

    const firstShown = totalDataLength === 0 ? 0 : pageIndex * pageSize + 1
    const lastShown = totalDataLength === 0 ? 0 : Math.min(pageIndex * pageSize + rowsOnPage, totalDataLength)

    return (
        <div
            className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E5EA] bg-[#F8F8FA] px-4 py-3 text-sm tracking-[0.01em] text-[#6E6E73] dark:border-[#38383A] dark:bg-[#242426] dark:text-[#98989D]">
            <span className="tabular-nums">
                Показано{" "}
                <span className="font-semibold text-[#1C1C1E] dark:text-[#F2F2F7]">
                    {firstShown}–{lastShown}
                </span>{" "}
                из{" "}
                <span className="font-semibold text-[#1C1C1E] dark:text-[#F2F2F7]">
                    {totalDataLength}
                </span>
            </span>

            <span className="tabular-nums">
                Страница{" "}
                <span className="text-zinc-800 dark:text-[#F2F2F7]">
                    {pageCount === 0 ? 0 : pageIndex + 1}
                </span>{" "}
                из {pageCount}
            </span>


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