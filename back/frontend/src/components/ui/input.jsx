import * as React from "react"
import {Input as InputPrimitive} from "@base-ui/react/input"
import {cn} from "cn"

function Input({
                   className,
                   type,
                   ...props
               }) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(
                "h-11 w-full min-w-0 rounded-[14px] border border-black/[0.06] bg-[#F2F2F7] px-3 py-2 text-base text-[#1C1C1E] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background-color,border-color,box-shadow] duration-200 outline-none placeholder:text-[#8E8E93] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:border-[#007AFF]/30 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#007AFF]/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black/[0.04] disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20 md:text-sm dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:text-white dark:placeholder:text-[#8E8E93] dark:focus-visible:border-[#0A84FF]/40 dark:focus-visible:bg-[#2C2C2E] dark:focus-visible:ring-[#0A84FF]/20 dark:disabled:bg-[#2C2C2E] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                className
            )}
            {...props}
        />
    )
}

export {Input}
