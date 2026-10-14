import {MoreHorizontal} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/actions/dropdown-menu.jsx"
import {cn} from "@/shared/lib/utils.js"

const TRIGGER_CLASS =
    "inline-flex h-8 cursor-pointer w-8 items-center justify-center rounded-md text-[#3C3C43] transition-colors hover:bg-black/5 hover:text-black active:bg-black/10 focus:outline-none focus:ring-0"

const CONTENT_CLASS =
    "min-w-44 rounded-xl border border-black/10 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#1C1C1E]"

const ITEM_CLASS =
    "cursor-pointer rounded-md px-2 py-1.5 text-[13px] outline-none transition-colors focus:bg-black/5 active:bg-black/10 dark:focus:bg-white/10"

const SEPARATOR_CLASS = "my-1 h-px bg-black/10 dark:bg-white/10"

export function RowActionsMenu({id, actions = [], triggerClassName}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(TRIGGER_CLASS, triggerClassName)}
                onClick={(e) => e.stopPropagation()}
            >
                <MoreHorizontal className="h-4 w-4"/>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className={CONTENT_CLASS}
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem
                    className={ITEM_CLASS}
                    onClick={() => navigator.clipboard.writeText(id)}
                >
                    Копировать ID
                </DropdownMenuItem>

                <DropdownMenuSeparator className={SEPARATOR_CLASS}/>

                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.label}
                        className={cn(ITEM_CLASS, action.className)}
                        onClick={action.onClick}
                    >
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
