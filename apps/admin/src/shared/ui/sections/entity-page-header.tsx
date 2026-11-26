import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {ArrowLeft} from "lucide-react"
import {Button} from "@site/ui/button"
import {ConfirmDialog} from "@site/ui/confirm-dialog"
import {cn} from "@site/ui/lib/utils" // Исправили импорт cn под ваш проект

export function EntityHeader({
                                 title,
                                 metadata,
                                 status,
                                 backLabel = "Назад",
                                 onBack = undefined,
                                 actions = [],
                                 className = "",
                             }) {
    const navigate = useNavigate()
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

    // Если onBack не передан, кнопка автоматически вернет на предыдущую страницу
    const handleBackClick = () => {
        if (onBack) {
            onBack()
        } else {
            navigate(-1)
        }
    }

    return (
        <>
            <header
                className={cn(
                    "flex w-full flex-col gap-3 border-b bg-white/90 p-4 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#1C1C1E]/90 sm:flex-row sm:items-center sm:justify-between sm:px-5",
                    className,
                )}
            >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBackClick}
                        className="shrink-0 rounded-full print:hidden"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4"/>
                        {backLabel}
                    </Button>

                    <span
                        aria-hidden="true"
                        className="hidden text-[#D1D1D6]"
                    >
                        /
                    </span>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-base font-semibold tracking-tight text-[#1C1C1E] dark:text-white sm:text-lg">
                                {title}
                            </h1>
                        </div>

                        {metadata && (
                            <div className="mt-1 text-xs text-[#8E8E93] dark:text-[#98989D]">
                                {metadata}
                            </div>
                        )}
                    </div>
                </div>

                {(status || actions.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {status && <div className="min-w-0">{status}</div>}
                        {actions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 print:hidden">
                                {actions.map((action) => {
                                    const Icon = action.icon
                                    return (
                                        <Button
                                            key={action.id ?? action.label}
                                            type="button"
                                            variant={action.variant ?? "outline"}
                                            disabled={action.disabled}
                                            onClick={() => handleActionClick(action)}
                                            className={cn("h-10 rounded-full active:scale-[0.98]", action.className)}
                                        >
                                            {Icon && <Icon aria-hidden="true" className="size-4"/>}
                                            {action.label}
                                        </Button>
                                    )
                                })}
                            </div>
                        )}
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