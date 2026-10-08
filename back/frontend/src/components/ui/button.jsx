import {Button as ButtonPrimitive} from "@base-ui/react/button"
import {cva} from "class-variance-authority";
import {cn} from "cn"

const buttonVariants = cva(
    "group/button inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-clip-padding font-sans text-sm font-semibold tracking-[-0.01em] transition-all duration-150 ease-out outline-none select-none focus-visible:ring-4 focus-visible:ring-[#007AFF]/25 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "bg-[#007AFF] text-white shadow-[0_2px_5px_rgba(0,122,255,0.22)] hover:bg-[#006FE6] active:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#168FFF] dark:active:bg-[#0077ED]",

                outline:
                    "border-black/10 bg-white/80 text-[#007AFF] shadow-sm backdrop-blur-xl hover:bg-white aria-expanded:bg-black/5 dark:border-white/10 dark:bg-white/[0.08] dark:text-[#0A84FF] dark:hover:bg-white/[0.14] dark:aria-expanded:bg-white/[0.14]",

                secondary:
                    "bg-[#F2F2F7] text-[#1C1C1E] hover:bg-[#E5E5EA] aria-expanded:bg-[#E5E5EA] dark:bg-[#2C2C2E] dark:text-white dark:hover:bg-[#3A3A3C] dark:aria-expanded:bg-[#3A3A3C]",

                ghost:
                    "text-[#007AFF] hover:bg-[#007AFF]/10 aria-expanded:bg-[#007AFF]/10 dark:text-[#0A84FF] dark:hover:bg-[#0A84FF]/10 dark:aria-expanded:bg-[#0A84FF]/10",

                destructive:
                    "bg-[#FF3B30]/10 text-[#D70015] hover:bg-[#FF3B30]/20 focus-visible:ring-[#FF3B30]/25 dark:bg-[#FF453A]/10 dark:text-[#FF453A] dark:hover:bg-[#FF453A]/20",

                link:
                    "text-[#007AFF] underline-offset-4 hover:underline dark:text-[#0A84FF]",
            },

            size: {
                default:
                    "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",

                xs:
                    "h-7 gap-1 rounded-lg px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",

                sm:
                    "h-9 gap-1.5 rounded-[10px] px-3 text-[0.85rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",

                lg:
                    "h-12 gap-2 rounded-2xl px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",

                icon: "size-11",

                "icon-xs":
                    "size-7 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",

                "icon-sm":
                    "size-9 rounded-[10px] in-data-[slot=button-group]:rounded-lg",

                "icon-lg": "size-12 rounded-2xl",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
                    className,
                    variant = "default",
                    size = "default",
                    ...props
                }) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({variant, size, className}))}
            {...props}
        />
    )
}

export {Button, buttonVariants}
