import {Sparkles} from "lucide-react";
import {Button} from "../../../../shared/ui/Button.jsx";
import {VariantRow} from "./VariantRow.jsx";

/* Секция 4. Варианты и количество */
export function VariantsSection({
                                    variants,
                                    sizePresets,
                                    onAddVariant,
                                    onUpdateVariant,
                                    onRemoveVariant,
                                    onRemovePhoto,
                                    onMakeVariantCover,
                                    onUploadPhotos,
                                    onOpenPhoto,
                                    onOpenMorePhotos,
                                }) {
    return (
        <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-200
                        bg-white p-3 sm:p-4"
        >
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase text-zinc-500">
                    Варианты и количество
                </span>

                <span
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full
                               bg-zinc-900 px-1.5 text-xs font-bold text-white"
                >
                    {variants.length}
                </span>
            </div>

            {/* Добавление варианта */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex w-full flex-col gap-2 rounded-xl bg-zinc-50 p-3 sm:w-auto">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium
                                    text-zinc-700 sm:justify-start"
                    >
                        <Sparkles
                            aria-hidden="true"
                            className="h-5 w-5 shrink-0 text-zinc-500"
                        />
                        <span>Быстро добавить варианты</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                        {sizePresets.map((size) => (
                            <Button
                                key={size}
                                text={size}
                                onClick={() => onAddVariant(size)}
                                className="min-w-[3rem] bg-white"
                            />
                        ))}
                    </div>
                </div>

                <Button
                    text="Свой вариант"
                    onClick={() => onAddVariant("")}
                    className="h-10 w-full bg-white sm:w-auto sm:min-w-40"
                />
            </div>

            <div className="w-full min-w-0">
                <VariantsTableHeader/>

                <div className="flex min-w-0 flex-col gap-2 pt-2">
                    {variants.map((variant, index) => (
                        <VariantRow
                            key={variant.clientId}
                            variant={variant}
                            onUpdate={(patch) => onUpdateVariant(index, patch)}
                            onRemove={() => onRemoveVariant(index)}
                            onRemovePhoto={(imageIndex) =>
                                onRemovePhoto(index, imageIndex)
                            }
                            onMakeVariantCover={(src) =>
                                onMakeVariantCover(index, src)
                            }
                            onUploadPhotos={(files) =>
                                onUploadPhotos(index, files)
                            }
                            onOpenPhoto={(imageIndex) =>
                                onOpenPhoto(index, imageIndex)
                            }
                            onOpenMorePhotos={() =>
                                onOpenMorePhotos?.(index)
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* Шапка таблицы вариантов */
function VariantsTableHeader() {
    return (
        <div
            className="grid grid-cols-[minmax(3.5rem,1fr)_minmax(4.5rem,1.1fr)_5rem_1.75rem]
                       items-center gap-x-1.5 border-b border-zinc-100 px-2 pb-2
                       text-[10px] font-medium uppercase tracking-wide text-zinc-400
                       sm:grid-cols-[4.5rem_5rem_5rem_minmax(0,1fr)_2rem]
                       sm:gap-x-3 sm:text-xs"
        >
            <div className="whitespace-nowrap text-center">Размер</div>
            <div className="whitespace-nowrap text-center">Остаток</div>
            <div className="whitespace-nowrap text-center">Своя цена</div>

            <div className="col-span-full mt-1 text-center sm:col-span-1 sm:mt-0">
                Фотографии
            </div>

            <div className="hidden sm:block"/>
        </div>
    );
}