import {MoreHorizontal} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"
import {cn} from "cn"

/* Меню действий строки таблицы (три точки). Одинаковая разметка была
   скопирована в колонки товаров и заказов: «Копировать ID» + разделитель +
   свои пункты из actions. */
const TRIGGER_CLASS =
    "h-8 w-8 inline-flex items-center justify-center rounded-md"

export function RowActionsMenu({id, actions = [], triggerClassName}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(TRIGGER_CLASS, triggerClassName)}
            >
                <MoreHorizontal className="h-4 w-4"/>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(id)}
                >
                    Копировать ID
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.label}
                        className={action.className}
                        onClick={action.onClick}
                    >
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}