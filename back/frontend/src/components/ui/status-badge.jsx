import {Badge} from "@/components/ui/badge.jsx"
import {cn} from "cn"

/* Палитра статусных «пилюль» админки. Раньше одни и те же наборы классов были
   скопированы в шапке заказа, в таймлайне, в карточке оплаты и в списке
   обращений — теперь тон задаётся словом, а классы живут в одном месте.
   Значения оставлены литералами, чтобы Tailwind их увидел. */
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
}

export function StatusBadge({tone = "info", className, ...props}) {
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