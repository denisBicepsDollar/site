import {Checkbox as CheckboxPrimitive} from "@base-ui/react/checkbox"
import {cn} from "cn"
import {CheckIcon} from "lucide-react"

function Checkbox({className, ...props}) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer cursor-pointer relative flex size-[18px] shrink-0 items-center justify-center rounded-[6px] border border-[#C7C7CC] bg-white text-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)] transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out outline-none after:absolute group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-[#C7C7CC] focus-visible:border-[#007AFF] focus-visible:ring-4 focus-visible:ring-[#007AFF]/20 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#FF3B30] aria-invalid:ring-4 aria-invalid:ring-[#FF3B30]/15 aria-invalid:aria-checked:border-[#007AFF] data-checked:border-[#007AFF] data-checked:bg-[#007AFF] data-checked:text-white dark:border-[#636366] dark:bg-[#2C2C2E] dark:group-has-[:focus-visible]/field-label:not-data-checked:border-[#636366] dark:aria-invalid:border-[#FF453A] dark:aria-invalid:ring-[#FF453A]/20 dark:data-checked:border-[#0A84FF] dark:data-checked:bg-[#0A84FF]",
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-opacity [&>svg]:size-3.5 [&>svg]:stroke-[2.75]"
            >
                <CheckIcon aria-hidden="true"/>
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export {Checkbox}