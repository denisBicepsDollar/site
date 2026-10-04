import {Sparkles} from "lucide-react";
import {PageButton} from "../../../shared/components/PageButton.jsx";
import {VariantRow} from "./VariantRow.jsx";

/* Секция 4. Варианты и количество: быстрое добавление размеров + таблица вариантов */
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
                                }) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <span className="flex text-xs font-semibold uppercase text-zinc-500">
                    Варианты и количество
                </span>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full
                                 bg-zinc-900 px-1.5 text-xs font-bold text-white">
                    {variants.length}
                </span>
            </div>

            {/* Добавление варианта */}
            <div className="flex flex-wrap items-end justify-between gap-2 text-sm font-medium">
                <div className="flex w-full flex-col gap-2 rounded-xl bg-zinc-50 p-3 sm:w-auto">
                    <div className="flex items-center gap-2">
                        <Sparkles aria-hidden="true" className="h-5 w-5"/>
                        Быстро добавить варианты
                    </div>
                    <div className="flex gap-2">
                        {sizePresets.map(size => (
                            <PageButton
                                key={size}
                                text={size}
                                onClick={() => onAddVariant(size)}
                                className="bg-white"
                            />
                        ))}
                    </div>
                </div>

                <PageButton
                    text="Свой вариант"
                    onClick={() => onAddVariant("")}
                    className="bg-white h-10"
                />
            </div>

            <div className="w-full overflow-x-auto">
                <div className="min-w-[820px]">
                    <VariantsTableHeader/>

                    <div className="flex flex-col gap-2">
                        {variants.map((variant, index) => (
                            <VariantRow
                                key={variant.clientId}
                                variant={variant}
                                onUpdate={patch => onUpdateVariant(index, patch)}
                                onRemove={() => onRemoveVariant(index)}
                                onRemovePhoto={imageIndex => onRemovePhoto(index, imageIndex)}
                                onMakeVariantCover={src => onMakeVariantCover(index, src)}
                                onUploadPhotos={files => onUploadPhotos(index, files)}
                                onOpenPhoto={imageIndex => onOpenPhoto(index, imageIndex)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Шапка таблицы вариантов */
function VariantsTableHeader() {
    return (
        <div className="flex gap-3 border-b border-zinc-100 p-2 text-xs font-medium uppercase text-zinc-400">
            <div className="flex w-1/12 shrink-0 justify-center">Размер</div>
            <div className="flex w-1/6 shrink-0 justify-center">Остаток</div>
            <div className="flex w-32 shrink-0 justify-center whitespace-nowrap">Своя цена</div>
            <div className="flex flex-1 justify-center">Фотографии</div>
            <div className="flex shrink-0"/>
        </div>
    );
}
