import {mergeProps} from "@base-ui/react/merge-props"
import {useRender} from "@base-ui/react/use-render"
import {cva} from "class-variance-authority"
import {cn} from "cn"

const badgeVariants = cva(
    "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.01em] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#007AFF]/25 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-[#FF3B30] aria-invalid:ring-[#FF3B30]/20 dark:focus-visible:ring-[#0A84FF]/30 dark:aria-invalid:border-[#FF453A] dark:aria-invalid:ring-[#FF453A]/25 [&>svg]:pointer-events-none [&>svg]:size-3",
    {
        variants: {
            variant: {
                default:
                    "bg-[#007AFF]/10 text-[#007AFF] [a]:hover:bg-[#007AFF]/20 dark:bg-[#0A84FF]/20 dark:text-[#64D2FF] dark:[a]:hover:bg-[#0A84FF]/30",
                secondary:
                    "bg-[#F2F2F7] text-[#636366] [a]:hover:bg-[#E5E5EA] dark:bg-[#2C2C2E] dark:text-[#AEAEB2] dark:[a]:hover:bg-[#3A3A3C]",
                destructive:
                    "bg-[#FF3B30]/10 text-[#D70015] focus-visible:ring-[#FF3B30]/20 [a]:hover:bg-[#FF3B30]/20 dark:bg-[#FF453A]/15 dark:text-[#FF6961] dark:focus-visible:ring-[#FF453A]/30 dark:[a]:hover:bg-[#FF453A]/25",
                outline:
                    "border-[#D1D1D6] text-[#1C1C1E] [a]:hover:bg-[#F2F2F7] dark:border-[#48484A] dark:text-[#F2F2F7] dark:[a]:hover:bg-[#2C2C2E]",
                ghost:
                    "text-[#636366] hover:bg-[#F2F2F7] hover:text-[#1C1C1E] dark:text-[#AEAEB2] dark:hover:bg-[#2C2C2E] dark:hover:text-white",
                link:
                    "text-[#007AFF] underline-offset-4 hover:underline dark:text-[#0A84FF]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

function Badge({className, variant = "default", render, ...props}) {
    return useRender({
        defaultTagName: "span",
        props: mergeProps(
            {
                className: cn(badgeVariants({variant}), className),
            },
            props,
        ),
        render,
        state: {
            slot: "badge",
            variant,
        },
    })
}

export {Badge, badgeVariants}