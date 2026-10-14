import {File, Image as ImageIcon} from "lucide-react"
import {PhotoTile} from "../ui/photo-tile.jsx"
import {buttonVariants} from "@/shared/ui/actions/button.jsx";

export function CoverPanel({cover, onOpen, onUpload}) {
    const handleUpload = (event) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (file) onUpload(file)
    }

    return (
        <div className="flex flex-col gap-4 sm:col-start-3 min-w-0">
            {/* Текстовая шапка панели */}
            <div className="flex flex-col gap-1">
                <span className="text-center text-sm font-semibold tracking-tight">
                    Обложка товара
                </span>
                <span className="text-center text-sm leading-normal text-zinc-500">
                    Кликните на фото, чтобы выбрать обложку товара, или загрузите своё.
                </span>
            </div>

            <div className="flex w-full flex-col gap-3">
                {cover ? (
                    <PhotoTile
                        src={cover}
                        alt="Обложка товара"
                        fluid
                        onOpen={onOpen}
                        openLabel="Просмотр"
                    />
                ) : (
                    /* Пустая заглушка под обложку */
                    <label className="
                        flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl
                        border border-dashed border-zinc-300 bg-zinc-100 p-4 text-center
                    ">
                        <div
                            className="rounded-full  p-3 text-zinc-500 shadow-sm">
                            <ImageIcon className="size-6" aria-hidden="true"/>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-[#6E6E73] ]">
                                Обложка не выбрана
                            </span>
                            <span className="max-w-[180px] text-xs text-zinc-400 ">
                                Выберите фото из списка или загрузите файл
                            </span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleUpload}
                        />
                    </label>
                )}

                <label className={`${buttonVariants({variant: 'outline'})}`}>
                    <File className="size-4" aria-hidden="true"/>
                    <span>Загрузить фото</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleUpload}
                    />
                </label>
            </div>
        </div>
    )
}