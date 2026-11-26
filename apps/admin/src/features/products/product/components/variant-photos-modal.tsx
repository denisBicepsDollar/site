import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@site/ui/dialog"
import {PhotoTile} from "@/features/products/product/ui/photo-tile.tsx";
import {UploadTile} from "@/features/products/product/ui/upload-tile.tsx";
import {Button} from "@site/ui/button";

export function VariantPhotosModal({
                                       open,
                                       onClose,
                                       variant,
                                       uploadError = null,
                                       onOpenPhoto,
                                       onRemovePhoto,
                                       onMakeVariantCover,
                                       onUploadPhotos,
                                   }) {
    const {clientId, name, images, previewImage} = variant;
    const variantLabel = name?.trim() || "Стандарт";
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose()
            }}
        >
            <DialogContent
                className="flex flex-col gap-0 overflow-hidden rounded-[22px] border-black/[0.06] bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:border-white/[0.08] dark:bg-[#1C1C1E]">
                <DialogHeader className="border-b border-[#E5E5EA] p-4 pr-12 text-left dark:border-[#38383A] sm:px-5">
                    <DialogTitle className="truncate text-base font-semibold text-[#1C1C1E] dark:text-white">
                        Фотографии варианта «{variantLabel}»
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#8E8E93] dark:text-[#98989D]">
                        {images.length} фото · Нажмите «Сделать обложкой» для выбора
                    </DialogDescription>
                </DialogHeader>

                {uploadError && (
                    <div role="alert" className="mx-4 mt-3 rounded-xl bg-[#FF3B30]/10 px-3.5 py-2 text-xs font-medium text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]">
                        {uploadError}
                    </div>
                )}

                <div
                    className="min-h-0 flex-1 flex flex-wrap gap-3 overflow-y-auto p-3 sm:p-5 min-w-min justify-start items-start">
                    {images.map((image, imageIndex) => {
                        const isCover = image === previewImage;
                        return (
                            <div key={`${clientId}-${image}-${imageIndex}`} className="shrink-0 flex flex-col gap-3 items-center">
                                <PhotoTile
                                    src={image}
                                    alt={`Фото ${imageIndex + 1}`}
                                    badge={isCover ? "Обложка" : null}
                                    onOpen={() => onOpenPhoto(imageIndex)}
                                    onRemove={() => onRemovePhoto(imageIndex)}
                                    makeCoverTitle={`Сделать обложкой варианта ${variantLabel}`}
                                />
                                <Button
                                    size="xs"
                                    variant={isCover ? "secondary" : "outline"}
                                    disabled={isCover}
                                    onClick={() => onMakeVariantCover(image)}>
                                    {isCover ? "Текущая обложка" : "Сделать обложкой"}
                                </Button>
                            </div>
                        );
                    })}
                    {onUploadPhotos && (
                        <UploadTile className="h-28 w-28" onFiles={onUploadPhotos}/>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
