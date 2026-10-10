import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/overlays/dialog.jsx"
import {PhotoTile} from "@/features/products/product/ui/photo-tile.jsx";
import {Button} from "@/shared/ui/actions/button.jsx";

export function VariantPhotosModal({open, onClose, variant, onOpenPhoto, onRemovePhoto, onMakeVariantCover, ...props}) {
    const {clientId, name, images, previewImage} = variant;
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose()
            }}
        >
            <DialogContent
                className="flex flex-col gap-0 overflow-hidden rounded-[22px] border-black/[0.06] bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <DialogHeader className="border-b border-[#E5E5EA] p-4 pr-12 text-left sm:px-5">
                    <DialogTitle className="truncate text-base font-semibold text-[#1C1C1E]">
                        Фотографии размера {name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#8E8E93]">
                        {images.length} фото · Нажмите «Сделать обложкой» для выбора
                    </DialogDescription>
                </DialogHeader>

                <div
                    className="min-h-0 flex-1 flex flex-wrap gap-3 overflow-y-auto p-3 sm:p-5 min-w-min justify-between items">
                    {images.map((image, imageIndex) => (
                        <div key={`${clientId}-${imageIndex}`} className="shrink-0 flex flex-col gap-3 items-center">
                            <PhotoTile
                                src={image}
                                alt={`Фото ${imageIndex + 1}`}
                                badge={image === previewImage ? `Обложка` : null}
                                onOpen={() => onOpenPhoto(imageIndex)}
                                onRemove={() => onRemovePhoto(imageIndex)}
                                makeCoverTitle={`Сделать обложкой варианта ${name}`}
                            />
                            <Button
                                size={"xs"}
                                variant={"outline"}
                                onClick={() => onMakeVariantCover(image)}>
                                Сделать
                                обложкой</Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}