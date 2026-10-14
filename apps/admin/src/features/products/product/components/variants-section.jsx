import {Sparkles} from "lucide-react";
import {Button} from "@/shared/ui/actions/button.jsx";
import {Badge} from "@/shared/ui/display/badge.jsx";
import {SectionCard} from "@/shared/ui/sections/section-card.jsx";
import {CardContent} from "@/shared/ui/display/card.jsx";
import {VariantRow} from "./variant-row.jsx";

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
        <SectionCard className="min-w-0">
            <CardContent className="flex min-w-0 flex-col gap-5 p-4 sm:p-5">

                <div className="flex items-center justify-between sm:justify-start gap-3">
                    <h2 className="text-sm font-semibold uppercase text-zinc-400">
                        Варианты и количество
                    </h2>

                    <Badge
                        variant="secondary"
                        className="h-5 min-w-5 px-1.5 text-sm font-bold">
                        {variants.length}
                    </Badge>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex w-full flex-col gap-2.5 rounded-2xl p-3.5 sm:w-auto flex-1 bg-zinc-100 border">
                        <div
                            className="flex items-center gap-2 text-sm  text-zinc-500 ">
                            <Sparkles className="h-4 w-4 shrink-0 text-blue-500"/>
                            <span>Быстро добавить варианты</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {sizePresets.map((size) => (
                                <Button
                                    key={size}
                                    type="button"
                                    variant="outline"
                                    size={'sm'}
                                    onClick={() => onAddVariant(size)}>
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Кнопка "Свой вариант" */}
                    <Button
                        variant="outline"
                        size={'lg'}
                        onClick={() => onAddVariant("")}>
                        Свой вариант
                    </Button>
                </div>

                {/* Таблица вариантов */}
                <div className="w-full min-w-0">
                    <VariantsTableHeader/>

                    <div
                        className="flex min-w-0 flex-col gap-2 pt-2">
                        {variants.map((variant, index) => (
                            <VariantRow
                                key={variant.clientId}
                                variant={variant}
                                onUpdate={(patch) => onUpdateVariant(index, patch)}
                                onRemove={() => onRemoveVariant(index)}
                                onRemovePhoto={(imageIndex) => onRemovePhoto(index, imageIndex)}
                                onMakeVariantCover={(src) => onMakeVariantCover(index, src)}
                                onUploadPhotos={(files) => onUploadPhotos(index, files)}
                                onOpenPhoto={(imageIndex) => onOpenPhoto(index, imageIndex)}
                                onOpenMorePhotos={() => onOpenMorePhotos?.(index)}
                            />
                        ))}
                    </div>
                </div>

            </CardContent>
        </SectionCard>
    );
}

/* Шапка таблицы вариантов */
function VariantsTableHeader() {
    return (
        <div
            className="
                hidden sm:grid
                grid-cols-[minmax(3rem,1fr)_minmax(4.5rem,1.1fr)_5.5rem_2rem]
                items-center gap-x-2 border-b border-black/[0.04] dark:border-white/[0.04] px-3 pb-2
                text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#8E8E93]

                sm:grid-cols-[5rem_6.5rem_6.5rem_minmax(0,1fr)_2.5rem]
                sm:gap-x-3 sm:text-xs
            "
        >
            <div className="text-center">Размер</div>
            <div className="text-center">Остаток</div>
            <div className="text-center">Своя цена</div>

            <div className="col-span-full mt-1 text-center sm:col-span-1 sm:mt-0  sm:pl-3">
                Фотографии
            </div>

            <div className="hidden sm:block"/>
        </div>
    );
}