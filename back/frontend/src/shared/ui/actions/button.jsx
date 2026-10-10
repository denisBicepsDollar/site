import {Button as ButtonPrimitive} from "@base-ui/react/button"
import {cva} from "class-variance-authority"
import {cn} from "@/shared/lib/utils"

const buttonVariants = cva(
    [
        "group/button inline-flex shrink-0 cursor-pointer items-center justify-center",
        "whitespace-nowrap border  bg-clip-padding",
        "font-sans text-sm font-medium tracking-[-0.01em]",
        "transition-all duration-150 ease-out outline-none select-none",
        "active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:ring-[3px] focus-visible:ring-[#007AFF]/30",
        "dark:focus-visible:ring-[#0A84FF]/35",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
    ].join(" "),
    {
        variants: {
            variant: {
                /* ── Основная синяя (iOS Blue) ── */
                default: [
                    "bg-[#007AFF] text-white",
                    "shadow-[0_1px_3px_rgba(0,122,255,0.25)]",
                    "hover:bg-[#0066D6]",
                    "active:bg-[#0055B3]",
                    "dark:bg-[#0A84FF]",
                    "dark:hover:bg-[#409CFF]",
                    "dark:active:bg-[#0070E0]",
                    "dark:shadow-[0_1px_3px_rgba(10,132,255,0.3)]",
                ].join(" "),

                /* ── Контурная (iOS Secondary / Tinted) ── */
                outline: [
                    "border-black/[0.12] bg-white/80 text-[#007AFF]",
                    "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
                    "backdrop-blur-xl",
                    "hover:bg-black/[0.04]",
                    "active:bg-black/[0.08]",
                    "dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-[#0A84FF]",
                    "dark:hover:bg-white/[0.12]",
                    "dark:active:bg-white/[0.16]",
                ].join(" "),

                /* ── Серая заливка (iOS Gray Fill) ── */
                secondary: [
                    "bg-[#F2F2F7] text-[#1C1C1E]",
                    "hover:bg-[#E5E5EA]",
                    "active:bg-[#D1D1D6]",
                    "dark:bg-[#2C2C2E] dark:text-white",
                    "dark:hover:bg-[#3A3A3C]",
                    "dark:active:bg-[#48484A]",
                ].join(" "),

                /* ── Прозрачная (iOS Plain / Ghost) ── */
                ghost: [
                    "border-transparent",
                    "text-[#007AFF]",
                    "hover:bg-[#007AFF]/10",
                    "active:bg-[#007AFF]/18",
                    "dark:text-[#0A84FF]",
                    "dark:hover:bg-[#0A84FF]/12",
                    "dark:active:bg-[#0A84FF]/20",
                ].join(" "),

                /* ── Деструктивная (iOS Red) ── */
                destructive: [
                    "bg-[#FF3B30]/12 text-[#FF3B30]",
                    "hover:bg-[#FF3B30]/20",
                    "active:bg-[#FF3B30]/28",
                    "focus-visible:ring-[#FF3B30]/30",
                    "dark:bg-[#FF453A]/15 dark:text-[#FF453A]",
                    "dark:hover:bg-[#FF453A]/25",
                    "dark:active:bg-[#FF453A]/35",
                    "dark:focus-visible:ring-[#FF453A]/35",
                ].join(" "),

                /* ── Ссылка ── */
                link: [
                    "text-[#007AFF] underline-offset-4",
                    "hover:underline",
                    "dark:text-[#0A84FF]",
                ].join(" "),
            },

            size: {
                /* ── Default: 44px — стандарт iOS touch target ── */
                default: "h-11 gap-2 rounded-2xl px-5",

                /* ── XS: компактный чип ── */
                xs: "h-7 gap-1 rounded-full px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",

                /* ── SM: 36px pill ── */
                sm: "h-9 gap-1.5 rounded-full px-3.5 text-[13px] [&_svg:not([class*='size-'])]:size-3.5",

                /* ── LG: 48px крупная ── */
                lg: "h-12 gap-2.5 rounded-2xl px-6 text-[15px]",

                /* ── Иконки ── */
                icon: "size-11 rounded-2xl",
                "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-9 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
                "icon-lg": "size-12 rounded-2xl",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

function Button({className, variant = "default", size = "default", ...props}) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({variant, size}), className)}
            {...props}
        />
    )
}

export {Button, buttonVariants}