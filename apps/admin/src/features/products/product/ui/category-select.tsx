import {ChevronDown} from "lucide-react"
import {Button} from "@site/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/shared/ui/actions/dropdown-menu.tsx"

export interface CategorySelectProps {
    value: string
    options: string[]
    onChange: (value: string) => void
}

export function CategorySelect({value, options, onChange}: CategorySelectProps) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 dark:text-[#98989D]">
                Категория
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="outline"
                            className="active:scale-100 min-w-[150px] text-zinc-800 dark:text-zinc-100"
                        >
                            <span className="truncate">
                                {value || "Выбрать категорию"}
                            </span>
                            <ChevronDown
                                aria-hidden="true"
                                className="ml-2 size-4 shrink-0 text-zinc-500 dark:text-[#98989D]"
                            />
                        </Button>
                    }
                />

                <DropdownMenuContent align="start" className="min-w-[150px]">
                    <DropdownMenuRadioGroup
                        value={value ?? ""}
                        onValueChange={onChange}
                    >
                        {options.map((category) => (
                            <DropdownMenuRadioItem
                                key={category}
                                value={category}
                            >
                                {category}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
