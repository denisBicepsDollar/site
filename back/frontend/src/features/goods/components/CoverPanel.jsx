import {File} from "lucide-react";

/* Правая колонка блока «Фотографии»: текущая обложка товара и её загрузка */
export function CoverPanel({cover, onOpen, onUpload}) {
    const handleUpload = event => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (file) onUpload(file);
    };

    return (
        <div className="flex min-w-0 flex-col items-center gap-2 sm:col-start-3">
            <span className="text-sm font-medium text-zinc-900">
                Текущая обложка
            </span>
            <span className="text-[11px] leading-tight text-zinc-400">
                Кликните на фото слева чтобы выбрать, или загрузите свое
            </span>

            <div className="flex w-full max-w-xs flex-col gap-2">
                <div className="flex gap-3">
                    {cover && (
                        <img
                            className="aspect-square w-full rounded-xl border border-zinc-200 object-cover shadow-sm"
                            src={cover}
                            alt="Обложка товара"
                            onClick={onOpen}
                        />
                    )}
                </div>

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg
                                  border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50">
                    <File className="h-4 w-4" aria-hidden="true"/>
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
