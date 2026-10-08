import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx"

/* Диалог подтверждения в стиле админки. Одинаковый внешний вид раньше был
   скопирован в трёх местах: шапка сущности, страница заказа и страница товара. */
export function ConfirmDialog({
                                  open,
                                  onOpenChange,
                                  title,
                                  description,
                                  cancelLabel = "Не сейчас",
                                  confirmLabel = "Продолжить",
                                  destructive = false,
                                  onConfirm,
                              }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                className="rounded-[22px] border-black/[0.06] bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#2C2C2E]/95">
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className="text-[17px] font-semibold tracking-tight text-[#1C1C1E] dark:text-white">
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-sm leading-relaxed text-[#6E6E73] dark:text-[#AEAEB2]">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2 sm:gap-2">
                    <AlertDialogCancel
                        className="h-10 rounded-full border-black/[0.08] bg-white text-[#1C1C1E] hover:bg-[#F2F2F7] dark:border-white/[0.1] dark:bg-[#3A3A3C] dark:text-white dark:hover:bg-[#48484A]">
                        {cancelLabel}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        className={
                            destructive
                                ? "h-10 rounded-full bg-[#FF3B30] text-white hover:bg-[#D70015] dark:bg-[#FF453A] dark:hover:bg-[#FF6961]"
                                : "h-10 rounded-full bg-[#007AFF] text-white hover:bg-[#006FE6] dark:bg-[#0A84FF] dark:hover:bg-[#168FFF]"
                        }>
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}