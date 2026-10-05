import {File, Image as ImageIcon} from "lucide-react";
import {PhotoTile} from "../ui/PhotoTile.jsx";

export function CoverPanel({cover, onOpen, onUpload}) {
    const handleUpload = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) onUpload(file);
    };

    return (
        <div className="flex flex-col gap-4 sm:col-start-3">
            <div className="flex flex-col gap-1">
                <span className="text-center text-sm font-semibold tracking-tight text-zinc-800">
                    Обложка товара
                </span>
                <span className="text-center text-xs leading-normal text-zinc-400">
                    Кликните на фото, чтобы выбрать обложку всего товара, или загрузите свое.
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
                    <div
                        className="flex aspect-square w-full flex-col items-center justify-center gap-2.5
                                   rounded-2xl border-2 border-dashed border-zinc-200
                                   bg-zinc-50/50 p-4 text-center"
                    >
                        <div className="rounded-full bg-zinc-100 p-2.5 text-zinc-400">
                            <ImageIcon className="h-6 w-6"/>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-zinc-500">
                                Обложка не выбрана
                            </span>
                            <span className="max-w-[180px] text-[10px] text-zinc-400">
                                Выберите из списка слева или загрузите файл
                            </span>
                        </div>
                    </div>
                )}

                <label
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl
                               border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium
                               text-zinc-700 shadow-sm transition-colors
                               hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98]"
                >
                    <File className="h-4 w-4 text-zinc-400" aria-hidden="true"/>
                    <span>Загрузить фото</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </label>
            </div>
        </div>
    );
}