import {ChevronDown} from "lucide-react"
import {Button} from "@/components/ui/button.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"

export function CategorySelect({value, options, onChange}) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
                Категория
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-10 min-w-[180px] justify-between rounded-[14px] border-black/[0.08] bg-white/80 px-3.5 text-[#1C1C1E] shadow-sm hover:bg-white dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:text-white dark:hover:bg-[#2C2C2E]"
                    >
                        <span className="truncate">
                            {value || "Выбрать категорию"}
                        </span>
                        <ChevronDown
                            aria-hidden="true"
                            className="ml-2 size-4 shrink-0 text-[#8E8E93]"
                        />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
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