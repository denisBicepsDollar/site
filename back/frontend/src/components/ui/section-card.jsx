import {cn} from "cn"
import {Card, CardHeader, CardTitle} from "@/components/ui/card.jsx"


/* Общая «оболочка» карточек админки: белый фон, тонкая рамка и мягкая тень.
   Используется на странице товара и на странице заказа. */
const SECTION_CARD_SHELL =
    "border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#1C1C1E]"

const SECTION_HEADER_CLASS = "p-4 pb-3"

const SECTION_TITLE_CLASS =
    "text-sm font-semibold text-[#1C1C1E] dark:text-white"

/* Скругление у страниц немного отличается: 18px у товара, 20px у заказа.
   Значения оставлены литералами, чтобы Tailwind их увидел. */
const SECTION_CARD_RADII = {
    18: "rounded-[18px]",
    20: "rounded-[20px]",
}

export function SectionCard({radius = 18, className, ...props}) {
    return (
        <Card
            className={cn(
                SECTION_CARD_SHELL,
                SECTION_CARD_RADII[radius],
                className,
            )}
            {...props}
        />
    )
}

/* Та же оболочка, но простым div — для панелей, которым нельзя быть Card
   (у Card свои flex/gap/py, они ломают грид-раскладку). */
export function SectionPanel({radius = 18, className, ...props}) {
    return (
        <div
            className={cn(
                SECTION_CARD_SHELL,
                SECTION_CARD_RADII[radius],
                className,
            )}
            {...props}
        />
    )
}

/* Заголовок секции: маленький полужирный текст, опциональная иконка слева
   и произвольное содержимое справа (бейдж, счётчик).
   className уходит на CardHeader — так сохраняются разные отступы
   (p-4 pb-3 у «Доставки» и p-4 pb-3 sm:px-5 у карточек заказа). */
export function SectionCardHeader({icon: Icon, title, className, children}) {
    return (
        <CardHeader className={cn(SECTION_HEADER_CLASS, className)}>
            <CardTitle
                className={cn(SECTION_TITLE_CLASS, Icon && "flex items-center gap-2")}
            >
                {Icon && <Icon className="size-4 text-[#8E8E93]"/>}
                {title}
            </CardTitle>

            {children}
        </CardHeader>
    )
}