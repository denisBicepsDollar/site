import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx"

export function VariantPhotosModal({open, onClose, name, images, ...props}) {
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose()
            }}
        >
            <DialogContent
                className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-[22px] border-black/[0.06] bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:border-white/[0.08] dark:bg-[#1C1C1E]">
                <DialogHeader className="border-b border-[#E5E5EA] p-4 pr-12 text-left dark:border-[#38383A] sm:px-5">
                    <DialogTitle className="truncate text-base font-semibold text-[#1C1C1E] dark:text-white">
                        Фотографии размера {name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#8E8E93] dark:text-[#98989D]">
                        {images.length} фото · Нажмите «Сделать обложкой» для выбора
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
                    {/* Оставь здесь текущую сетку PhotoTile */}
                </div>
            </DialogContent>
        </Dialog>
    )
}