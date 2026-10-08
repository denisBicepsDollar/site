import {cn} from "cn"

/* Единый стиль маленьких uppercase-заголовков секций админки:
   «Название товара», «Описание», «Статус», «Фотографии», «Заметки». */
const SECTION_TITLE_CLASS =
    "text-xs font-semibold tracking-wide text-[#6E6E73] uppercase dark:text-[#AEAEB2]"

/* as — во что рендерить: "h2", "span" или компонент (например, Label ради htmlFor). */
export function SectionTitle({as = "span", className, ...props}) {
    const Tag = as
    return <Tag className={cn(SECTION_TITLE_CLASS, className)} {...props}/>
}
