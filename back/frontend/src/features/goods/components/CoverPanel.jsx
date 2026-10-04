import {File, Image as ImageIcon} from "lucide-react";

export function CoverPanel({cover, onOpen, onUpload}) {
    const handleUpload = event => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) onUpload(file);
    };

    return (
        <div className="flex flex-col gap-4 sm:col-start-3">
            <div className="flex flex-col gap-1">
                <span className="text-sm text-center font-semibold tracking-tight text-zinc-800">
                    Обложка товара
                </span>
                <span className="text-xs text-center leading-normal text-zinc-400">
                    Кликните на фото слева, чтобы выбрать, или загрузите новое.
                </span>
            </div>

            <div className="flex justify-between h-full w-full flex-col gap-3">
                {cover ? (
                    <div
                        onClick={onOpen}
                        className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-xs transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                    >
                        <img
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                            src={cover}
                            alt="Обложка товара"
                        />
                        <div
                            className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10 flex items-center justify-center">
                            <span
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs font-medium">
                                Просмотр
                            </span>
                        </div>
                    </div>
                ) : (
                    /* Красивый Placeholder, когда обложка не выбрана */
                    <div
                        className="flex aspect-square w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center">
                        <div className="rounded-full bg-zinc-100 p-2.5 text-zinc-400">
                            <ImageIcon className="h-6 w-6"/>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-zinc-500">Обложка не выбрана</span>
                            <span className="text-[10px] text-zinc-400 max-w-[180px]">Выберите из списка слева или загрузите файл</span>
                        </div>
                    </div>
                )}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl
                                  border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 shadow-xs
                                  transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-98">
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