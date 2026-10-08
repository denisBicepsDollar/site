import {cn} from "cn"

/* «Мягкая» обёртка полей ввода админки: серый фон, скругление 14px и синее
   кольцо, когда фокус внутри обёртки. Сам контроль (Input, счётчик символов,
   знак «₽») кладётся в children.
   Отличия места (высота, gap, тёмный фон) докладываются через className —
   так «Название товара» и «Базовая цена» выглядят ровно как раньше. */
const SECTION_FIELD_SHELL =
    "flex items-center rounded-[14px] border border-black/[0.06] bg-[#F2F2F7] px-3 transition-all focus-within:border-[#007AFF]/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#007AFF]/15 dark:border-white/[0.08] dark:focus-within:ring-[#0A84FF]/20"

export function SectionField({className, ...props}) {
    return <div className={cn(SECTION_FIELD_SHELL, className)} {...props}/>
}