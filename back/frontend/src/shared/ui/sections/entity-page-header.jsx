import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {ArrowLeft} from "lucide-react"
import {Button} from "@/shared/ui/actions/button.jsx"
import {ConfirmDialog} from "@/shared/ui/overlays/confirm-dialog.jsx"
import {cn} from "@/shared/lib/utils.js" // Исправили импорт cn под ваш проект

export function EntityHeader({
                                 title,
                                 metadata,
                                 status,
                                 backLabel = "Назад",
                                 onBack,
                                 actions = [],
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
                className="
                    flex w-full flex-col gap-3
                    border-b bg-white/90 p-4 backdrop-blur-2xl
                    sm:flex-row sm:items-center sm:justify-between sm:px-5
                "
            >
                <div className="flex min-w-0 items-center justify-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBackClick}
                        className="shrink-0 rounded-full "
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

                    <div className="hidden min-w-0">
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

                {actions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {status}
                            </div>
                        </div>
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