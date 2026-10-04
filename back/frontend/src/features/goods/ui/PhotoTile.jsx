import {ArrowUp, X} from "lucide-react";

/* Размеры плитки фото: большая (блок «Фотографии») и маленькая (строка варианта) */
const SIZES = {
    md: {wrapper: "h-28 w-28 sm:h-32 sm:w-32", image: "rounded-xl"},
    sm: {wrapper: "h-16 w-20 overflow-hidden rounded-lg", image: ""},
};

/* Плитка одного фото: превью, подпись-обложка и кнопки поверх
   (удалить / сделать обложкой). Кнопки показываются, только если переданы колбэки. */
export function PhotoTile({
                              src,
                              alt,
                              size = "md",
                              badge = null,
                              onOpen,
                              onRemove,
                              onMakeCover,
                              makeCoverTitle = "Сделать обложкой",
                          }) {
    const {wrapper, image} = SIZES[size];

    return (
        <div className={`group relative shrink-0 cursor-pointer ${wrapper}`}>
            <img
                className={`h-full w-full object-cover ${image}`}
                src={src}
                alt={alt}
                onClick={onOpen}
            />

            <div className="absolute right-1 top-1 z-10 flex gap-1 opacity-100
                            transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                {onRemove && (
                    <button
                        type="button"
                        title="Удалить фото"
                        aria-label="Удалить фото"
                        onClick={onRemove}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg
                                   bg-black/65 text-white hover:bg-black/85">
                        <X className="h-5 w-5"/>
                    </button>
                )}

                {onMakeCover && (
                    <button
                        type="button"
                        title={makeCoverTitle}
                        aria-label={makeCoverTitle}
                        onClick={onMakeCover}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg
                                   bg-black/65 text-white hover:bg-black/85">
                        <ArrowUp className="h-5 w-5"/>
                    </button>
                )}
            </div>

            {badge && (
                <div className="absolute bottom-1 left-1 flex flex-wrap gap-1">
                    <span className="rounded bg-black/70 px-2 py-1 text-[10px] text-white">
                        {badge}
                    </span>
                </div>
            )}
        </div>
    );
}
