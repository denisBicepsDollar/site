import {Check, Clock3, X} from "lucide-react"

import {CardContent} from "@/components/ui/card.jsx"
import {SectionCard} from "@/components/ui/section-card.jsx"
import {StatusBadge} from "@/components/ui/status-badge.jsx"

import {cn} from "cn"

export function OrderTimeline({
                                  steps,
                                  currentStep,
                                  timestamps = [],
                                  cancelled = false,
                                  className = "",
                              }) {
    const stepCount = steps.length
    const currentTitle = cancelled
        ? "Отменён"
        : steps[currentStep]?.title ?? "—"

    const progress = stepCount
        ? Math.round(
            ((cancelled ? currentStep : currentStep + 1) / stepCount) * 100,
        )
        : 0

    return (
        <SectionCard radius={20} className={cn("min-w-0", className)}>

            <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-[#1C1C1E] dark:text-white">
                            Ход заказа
                        </h2>
                        <p className="mt-1 text-xs text-[#8E8E93] dark:text-[#98989D]">
                            {cancelled
                                ? "Заказ отменён"
                                : `${currentStep + 1} из ${stepCount} этапов`}
                        </p>
                    </div>

                    <StatusBadge tone={cancelled ? "danger" : "info"}>
                        {currentTitle}
                    </StatusBadge>
                </div>


                {/* Один список: одновременно прогресс и история */}
                <ol className="grid grid-cols-1 gap-y-0 sm:grid-cols-5 sm:gap-x-2">
                    {steps.map((step, index) => {
                        const complete = index < currentStep
                        const active = index === currentStep && !cancelled
                        const stopped = index === currentStep && cancelled

                        const time = complete
                            ? timestamps[index] ?? "Выполнено"
                            : active
                                ? "Сейчас"
                                : stopped
                                    ? "Заказ отменён"
                                    : null

                        return (
                            <li
                                key={step.title}
                                className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0 sm:flex sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center"
                            >
                                {index < stepCount - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            "absolute left-[15px] top-8 bottom-0 w-px sm:left-[calc(50%+16px)] sm:right-[-50%] sm:top-4 sm:bottom-auto sm:h-px sm:w-auto",
                                            index < currentStep
                                                ? cancelled
                                                    ? "bg-[#34C759] dark:bg-[#30D158]"
                                                    : "bg-[#007AFF] dark:bg-[#0A84FF]"
                                                : "bg-[#E5E5EA] dark:bg-[#38383A]",
                                        )}
                                    />
                                )}

                                <span
                                    className={cn(
                                        "relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                                        complete &&
                                        "border-[#007AFF] bg-[#007AFF] text-white dark:border-[#0A84FF] dark:bg-[#0A84FF]",
                                        active &&
                                        "border-[#007AFF] bg-[#007AFF]/10 text-[#007AFF] ring-4 ring-[#007AFF]/10 dark:border-[#0A84FF] dark:bg-[#0A84FF]/15 dark:text-[#64D2FF]",
                                        stopped &&
                                        "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30] dark:border-[#FF453A] dark:text-[#FF6961]",
                                        !complete &&
                                        !active &&
                                        !stopped &&
                                        "border-[#D1D1D6] bg-white text-[#8E8E93] dark:border-[#48484A] dark:bg-[#2C2C2E] dark:text-[#98989D]",
                                    )}
                                >
                                    {complete ? (
                                        <Check className="size-4"/>
                                    ) : stopped ? (
                                        <X className="size-4"/>
                                    ) : active ? (
                                        <Clock3 className="size-3.5"/>
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                <div className="min-w-0 pt-0.5 sm:pt-0">
                                    <p
                                        className={cn(
                                            "text-[13px] font-medium",
                                            complete || active
                                                ? "text-[#1C1C1E] dark:text-white"
                                                : stopped
                                                    ? "text-[#D70015] dark:text-[#FF6961]"
                                                    : "text-[#8E8E93] dark:text-[#98989D]",
                                        )}
                                    >
                                        {step.title}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#8E8E93] dark:text-[#98989D]">
                                        {step.description}
                                    </p>

                                    {time && (
                                        <time
                                            className="mt-1 block text-[11px] tabular-nums text-[#8E8E93] dark:text-[#98989D]">
                                            {time}
                                        </time>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ol>
            </CardContent>
        </SectionCard>
    )
}