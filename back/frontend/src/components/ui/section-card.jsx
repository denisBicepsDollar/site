import {Card} from "@/components/ui/card.jsx"
import {cn} from "cn"

/* Общая «оболочка» карточек админки: белый фон, тонкая рамка и мягкая тень.
   Используется на странице товара и на странице заказа. */
const SECTION_CARD_SHELL =
    "border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#1C1C1E]"

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
