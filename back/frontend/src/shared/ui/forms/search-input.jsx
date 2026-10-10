import {Search, X} from "lucide-react"
import {useState} from "react";
import {Input} from "@/shared/ui/forms/input.jsx"
import {cn} from "cn"

/* Поле поиска админки: иконка слева + Input с отступом под неё.
   Одинаковая разметка была в тулбаре таблиц и в списке обращений.
   className — на обёртку, iconClassName — на иконку, inputClassName — на Input. */
export function SearchInput({
                                className,
                                iconClassName,
                                inputClassName,
                                onChange,
                                ...props
                            }) {
    const [value, setValue] = useState("")

    const handleChange = (e) => {
        const nextValue = e.target.value
        setValue(nextValue)
        onChange?.(e)
    }

    const handleClear = () => {
        setValue("")
        onChange?.({
            target: {value: ""},
        })
    }

    return (
        <div className={cn("relative", className)}>
            <Search
                aria-hidden="true"
                className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]",
                    iconClassName,
                )}
            />

            <Input
                {...props}
                className={cn("pl-9 pr-9", inputClassName)}
                value={value}
                onChange={handleChange}
            />

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
                >
                    <X className="size-4"/>
                </button>
            )}
        </div>
    )
}
