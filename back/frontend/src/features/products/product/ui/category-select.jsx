import {ChevronDown} from "lucide-react"
import {Button} from "@/shared/ui/actions/button.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/shared/ui/actions/dropdown-menu.jsx"

export function CategorySelect({value, options, onChange}) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 ">
                Категория
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button
                        variant="outline"
                        className="active:scale-100 min-w-[150px] text-zinc-800"
                    >
                        <span className="truncate">
                            {value || "Выбрать категорию"}
                        </span>
                        <ChevronDown
                            aria-hidden="true"
                            className="ml-2 size-4 shrink-0 text-zinc-500"
                        />
                    </Button>

                }>
                </DropdownMenuTrigger>

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