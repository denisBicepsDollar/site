import {cn} from "@/shared/lib/utils" // ИСПРАВЛЕНО

const SECTION_FIELD_SHELL =
    "flex items-center rounded-[10px] border border-black/[0.04] bg-[#F2F2F7] px-3 transition-all focus-within:border-[#007AFF]/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#007AFF]/15 dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:focus-within:bg-black dark:focus-within:ring-[#0A84FF]/20"

export function SectionField({className, ...props}) {
    return <div className={cn(SECTION_FIELD_SHELL, className)} {...props} />
}