import * as React from "react"
import {cva} from "class-variance-authority"
import {cn} from "@/shared/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center gap-1 min-w-0 rounded-full border border-transparent px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.01em]  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/25 [&>svg]:pointer-events-none [&>svg]:size-3",
    {
        variants: {
            variant: {
                default:
                    "bg-[#007AFF]/10 text-zinc-800 dark:bg-[#0A84FF]/20 dark:text-[#64D2FF]",
                secondary:
                    "bg-[#F2F2F7] text-[#1C1C1E] dark:bg-[#2C2C2E] dark:text-[#AEAEB2]",
                destructive:
                    "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]",
                outline:
                    "border-[#D1D1D6] text-[#1C1C1E] dark:border-[#48484A] dark:text-[#F2F2F7]",
                ghost:
                    "text-[#636366] hover:bg-[#F2F2F7] dark:text-[#AEAEB2] dark:hover:bg-[#2C2C2E]",
                link:
                    "text-[#007AFF] underline-offset-4 hover:underline dark:text-[#0A84FF]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

function Badge({className, variant = "default", ...props}) {
    return (
        <span className={cn(badgeVariants({variant}), className)} {...props} />
    )
}

export {Badge, badgeVariants}