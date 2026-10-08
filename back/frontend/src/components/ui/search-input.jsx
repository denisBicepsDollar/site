import {Search} from "lucide-react"

import {Input} from "@/components/ui/input.jsx"
import {cn} from "cn"

/* Поле поиска админки: иконка слева + Input с отступом под неё.
   Одинаковая разметка была в тулбаре таблиц и в списке обращений.
   className — на обёртку, iconClassName — на иконку, inputClassName — на Input. */
export function SearchInput({className, iconClassName, inputClassName, ...props}) {
    return (
        <div className={cn("relative", className)}>
            <Search
                aria-hidden="true"
                className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]",
                    iconClassName,
                )}
            />

            <Input className={cn("pl-9", inputClassName)} {...props}/>
        </div>
    )
}