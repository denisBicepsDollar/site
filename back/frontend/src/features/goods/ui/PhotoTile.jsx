import {ArrowUp, X} from "lucide-react";
import {SIZES} from "../constants.js";

/* Плитка фото: превью, подпись и кнопки поверх */
export function PhotoTile({
                              src,
                              alt,
                              size = "md",
                              badge = null,
                              onOpen,
                              onRemove,
                              onMakeCover,
                              makeCoverTitle = "Сделать обложкой",
                              fluid = false,
                              openLabel = null,
                              className = "",
                          }) {
    const {wrapper = "", image = ""} = SIZES[size] ?? {};

    // fluid нужен для большой обложки на всю ширину панели.
    const wrapperSize = fluid ? "aspect-square w-full" : wrapper;
    const imageSize = fluid ? "" : image;

    return (
        <div
            className={`group relative isolate shrink-0 cursor-pointer overflow-hidden rounded-2xl
                        bg-zinc-100 shadow-sm ring-1 ring-zinc-900/5
                        transition-shadow duration-300 hover:shadow-md
                        ${wrapperSize} ${className}`}
        >
            <img
                className={`h-full w-full object-cover transition-transform duration-500 ease-out
                            group-hover:scale-[1.05] ${imageSize}`}
                src={src}
                alt={alt}
                onClick={onOpen}
            />

            {openLabel && (
                <div
                    className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center
                               bg-zinc-950/0 transition-colors duration-200
                               group-hover:bg-zinc-950/10"
                >
                    <span
                        className="rounded-lg border border-white/70 bg-white/90 px-3 py-1.5
                                   text-xs font-medium text-zinc-700 opacity-0 shadow-sm backdrop-blur-sm
                                   transition-opacity duration-200 group-hover:opacity-100"
                    >
                        {openLabel}
                    </span>
                </div>
            )}

            <div
                className="absolute right-2 top-2 z-10 flex gap-1.5 opacity-100
                           transition-all duration-200
                           sm:translate-y-1 sm:opacity-0
                           sm:group-hover:translate-y-0 sm:group-hover:opacity-100
                           sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100"
            >
                {onRemove && (
                    <button
                        type="button"
                        title="Удалить фото"
                        aria-label="Удалить фото"
                        onClick={onRemove}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center
                                   rounded-xl border border-white/20 bg-slate-950/60 text-white
                                   shadow-lg shadow-black/20 backdrop-blur-md
                                   transition-all duration-200 hover:scale-105 hover:bg-rose-500
                                   active:scale-95 focus-visible:outline-none
                                   focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                )}

                {onMakeCover && (
                    <button
                        type="button"
                        title={makeCoverTitle}
                        aria-label={makeCoverTitle}
                        onClick={onMakeCover}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center
                                   rounded-xl border border-white/40 bg-white/90 text-slate-800
                                   shadow-lg shadow-black/20 backdrop-blur-md
                                   transition-all duration-200 hover:scale-105 hover:bg-amber-300
                                   active:scale-95 focus-visible:outline-none
                                   focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <ArrowUp className="h-4 w-4"/>
                    </button>
                )}
            </div>

            {badge && (
                <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 flex min-w-0">
                    <span
                        className="max-w-full truncate rounded-lg border border-white/80
                                   bg-white/90 px-2 py-1 text-[10px] font-medium text-zinc-700
                                   shadow-sm backdrop-blur-sm"
                    >
                        {badge}
                    </span>
                </div>
            )}
        </div>
    );
}