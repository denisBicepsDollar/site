import type {ComponentPropsWithoutRef} from "react"
import {Badge} from "@site/ui/badge"
import {cn} from "cn"

/* Палитра статусных «пилюль» админки. */
const STATUS_TONES = {
    /* синий — обычный/текущий статус */
    info: "bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#64D2FF]",
    /* зелёный — оплачено, сохранено, выполнено */
    success:
        "bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158]",
    /* красный — отменено, ошибка, есть несохранённые изменения */
    danger: "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]",
    /* оранжевый — ждёт действия */
    warning:
        "bg-[#FF9F0A]/10 text-[#A65E00] dark:bg-[#FF9F0A]/15 dark:text-[#FFB340]",
    /* серый — нейтральный статус (цвет не добавляем, остаётся secondary-подложка) */
    neutral: "",
} as const

export type StatusTone = keyof typeof STATUS_TONES

export interface StatusBadgeProps extends ComponentPropsWithoutRef<"span"> {
    tone?: StatusTone
    className?: string
}

export function StatusBadge({tone = "info", className = "", ...props}: StatusBadgeProps) {
    return (
        <Badge
            variant="secondary"
            className={cn(
                "rounded-full",
                STATUS_TONES[tone] ?? STATUS_TONES.neutral,
                className,
            )}
            {...props}
        />
    )
}
