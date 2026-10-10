import {Textarea} from "@/shared/ui/forms/textarea.jsx"
import {cn} from "cn"

/* «Мягкое» текстовое поле форм админки (фон #F2F2F7, синее кольцо при фокусе).
   Минимальную высоту задаёт потребитель через className: min-h-[…px]. */
const SECTION_TEXTAREA_CLASS =
    "resize-none rounded-[14px] border-black/[0.06] bg-[#F2F2F7] px-3 py-3 text-sm leading-relaxed text-[#1C1C1E] shadow-none placeholder:text-[#AEAEB2] focus-visible:border-[#007AFF]/35 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#007AFF]/15 dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:text-white dark:focus-visible:border-[#0A84FF]/40 dark:focus-visible:bg-[#3A3A3C] dark:focus-visible:ring-[#0A84FF]/20"

export function SectionTextarea({className, ...props}) {
    return (
        <Textarea
            className={cn(SECTION_TEXTAREA_CLASS, className)}
            {...props}
        />
    )
}