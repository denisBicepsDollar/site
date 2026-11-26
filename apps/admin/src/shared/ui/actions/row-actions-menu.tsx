import {useState} from "react"
import {MoreHorizontal} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/actions/dropdown-menu.tsx"
import {cn} from "@site/ui/lib/utils"

const TRIGGER_CLASS =
    "inline-flex h-8 cursor-pointer w-8 items-center justify-center rounded-md text-[#3C3C43] transition-colors hover:bg-black/5 hover:text-black active:bg-black/10 focus:outline-none focus:ring-0 dark:text-[#AEAEB2] dark:hover:bg-white/10 dark:hover:text-white"

const CONTENT_CLASS =
    "min-w-44 rounded-xl border border-black/10 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#1C1C1E]"

const ITEM_CLASS =
    "cursor-pointer rounded-md px-2 py-1.5 text-[13px] outline-none transition-colors focus:bg-black/5 active:bg-black/10 dark:focus:bg-white/10"

const SEPARATOR_CLASS = "my-1 h-px bg-black/10 dark:bg-white/10"

export interface RowAction {
    label: string
    className?: string
    onClick: () => void
}

export interface RowActionsMenuProps {
    id: string | number
    actions?: RowAction[]
    triggerClassName?: string
}

async function copyTextSafely(text: string): Promise<boolean> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch {
            // fallback below
        }
    }
    if (typeof document === "undefined") return false
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    let ok = false
    try {
        ok = document.execCommand("copy")
    } catch {
        ok = false
    } finally {
        document.body.removeChild(textarea)
    }
    return ok
}

export function RowActionsMenu({id, actions = [], triggerClassName = ""}: RowActionsMenuProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const ok = await copyTextSafely(String(id))
        if (ok) {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="Действия со строкой"
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
                        onClick={handleCopy}
                    >
                        {copied ? "ID скопирован" : "Копировать ID"}
                    </DropdownMenuItem>

                    {actions.length > 0 && <DropdownMenuSeparator className={SEPARATOR_CLASS}/>}

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
        </div>
    )
}
