import {cn} from "cn"

function Table({className, ...props}) {
    return (
        <div
            data-slot="table-container"
            className="relative w-full overflow-x-auto rounded-[14px]"
        >
            <table
                data-slot="table"
                className={cn(
                    "table-fixed w-full caption-bottom bg-white text-[13px] font-sans text-[#1C1C1E] dark:bg-[#1C1C1E] dark:text-[#F2F2F7]",
                    className,
                )}
                {...props}
            />
        </div>
    )
}

function TableHeader({className, ...props}) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                "bg-[#F8F8FA] text-[#6E6E73] [&_tr]:border-b [&_tr]:border-[#E5E5EA] dark:bg-[#242426] dark:text-[#98989D] dark:[&_tr]:border-[#38383A]",
                className,
            )}
            {...props}
        />
    )
}

function TableBody({className, ...props}) {
    return (
        <tbody
            data-slot="table-body"
            className={cn(
                "bg-white cursor-pointer [&_tr:last-child]:border-0 dark:bg-[#1C1C1E]",
                className,
            )}
            {...props}
        />
    )
}

function TableFooter({className, ...props}) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                "border-t border-[#E5E5EA] bg-[#F2F2F7] font-medium dark:border-[#38383A] dark:bg-[#2C2C2E] [&>tr]:last:border-b-0",
                className,
            )}
            {...props}
        />
    )
}

function TableRow({className, ...props}) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "border-b border-[#E5E5EA] transition-colors duration-150 hover:bg-[#F8F8FA] has-aria-expanded:bg-[#F2F2F7] data-[state=selected]:bg-[#EAF3FF] dark:border-[#38383A] dark:hover:bg-[#2C2C2E] dark:has-aria-expanded:bg-[#2C2C2E] dark:data-[state=selected]:bg-[#15324F]",
                className,
            )}
            {...props}
        />
    )
}

function TableHead({className, ...props}) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "h-11 px-4 text-left align-middle text-xs font-semibold tracking-[0.01em] whitespace-nowrap text-[#6E6E73] [&:has([role=checkbox])]:pr-0 dark:text-[#98989D]",
                className,
            )}
            {...props}
        />
    )
}

function TableCell({className, ...props}) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "px-6 py-3 align-middle text-[13px] whitespace-nowrap text-[#1C1C1E] [&:has([role=checkbox])]:pr-0 dark:text-[#F2F2F7]",
                className,
            )}
            {...props}
        />
    )
}

function TableCaption({className, ...props}) {
    return (
        <caption
            data-slot="table-caption"
            className={cn(
                "mt-3 px-4 text-[13px] text-[#8E8E93]",
                className,
            )}
            {...props}
        />
    )
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}