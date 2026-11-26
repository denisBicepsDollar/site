import type {ComponentPropsWithoutRef, ElementType, ReactNode} from "react"
import {cn} from "cn"

/* Единый стиль маленьких uppercase-заголовков секций админки:
   «Название товара», «Описание», «Статус», «Фотографии», «Заметки». */
const SECTION_TITLE_CLASS =
    "text-xs font-semibold wide text-[#6E6E73] uppercase dark:text-[#AEAEB2]"

type SectionTitleProps<T extends ElementType = "span"> = {
    as?: T
    className?: string
    children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">

/* as — во что рендерить: "h2", "span" или компонент (например, Label ради htmlFor). */
export function SectionTitle<T extends ElementType = "span">({
    as,
    className = "",
    ...props
}: SectionTitleProps<T>) {
    const Tag = (as ?? "span") as ElementType
    return <Tag className={cn(SECTION_TITLE_CLASS, className)} {...props}/>
}
