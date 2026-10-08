import {useState} from "react"
import {ArrowLeft} from "lucide-react"

import {Button} from "@/components/ui/button.jsx"
import {ConfirmDialog} from "@/components/ui/confirm-dialog.jsx"
import {cn} from "cn"

export function EntityHeader({
                                 title,
                                 metadata,
                                 status,
                                 backLabel = "Назад",
                                 onBack,
                                 actions = [],
                             }) {
    const [pendingAction, setPendingAction] = useState(null)
    const confirmation = pendingAction?.confirm

    const handleActionClick = (action) => {
        if (action.confirm) {
            setPendingAction(action)
            return
        }

        action.onClick?.()
    }

    const handleConfirm = () => {
        const action = pendingAction?.onClick
        setPendingAction(null)
        action?.()
    }

    return (
        <>
            <header
                className="sticky top-0 z-30 flex w-full flex-col gap-3 border-b border-black/[0.06] bg-white/85 p-4 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#1C1C1E]/85 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        className="shrink-0 rounded-full text-[#007AFF] hover:bg-[#007AFF]/10 dark:text-[#0A84FF] dark:hover:bg-[#0A84FF]/10"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4"/>
                        {backLabel}
                    </Button>

                    <span
                        aria-hidden="true"
                        className="text-[#D1D1D6] dark:text-[#48484A]"
                    >
                        /
                    </span>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-base font-semibold tracking-tight text-[#1C1C1E] dark:text-white sm:text-lg">
                                {title}
                            </h1>
                            {status}
                        </div>

                        {metadata && (
                            <div className="mt-1 text-xs text-[#8E8E93] dark:text-[#98989D]">
                                {metadata}
                            </div>
                        )}
                    </div>
                </div>

                {actions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {actions.map((action) => {
                            const Icon = action.icon

                            return (
                                <Button
                                    key={action.id ?? action.label}
                                    type="button"
                                    variant={action.variant ?? "outline"}
                                    disabled={action.disabled}
                                    onClick={() => handleActionClick(action)}
                                    className={cn(
                                        "h-10 rounded-full active:scale-[0.98]",
                                        action.className,
                                    )}
                                >
                                    {Icon && (
                                        <Icon
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    )}
                                    {action.label}
                                </Button>
                            )
                        })}
                    </div>
                )}
            </header>

            <ConfirmDialog
                open={Boolean(pendingAction)}
                onOpenChange={(open) => {
                    if (!open) setPendingAction(null)
                }}
                title={confirmation?.title}
                description={confirmation?.description}
                cancelLabel="Не сейчас"
                confirmLabel={confirmation?.actionLabel ?? "Продолжить"}
                destructive={Boolean(confirmation?.destructive)}
                onConfirm={handleConfirm}
            />
        </>
    )
}