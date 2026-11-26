import {CardContent} from "@site/ui/card"
import {Input} from "@site/ui/input"
import {Label} from "@site/ui/label"
import {SectionCard} from "@/shared/ui/sections/section-card.tsx"
import {SectionTitle} from "@/shared/ui/sections/section-title.tsx"
import {SectionField} from "@/shared/ui/sections/section-field.tsx"

import {CATEGORIES, MAX_NAME_LENGTH} from "../constants.ts"
import {CategorySelect} from "../ui/category-select.tsx"
import {CharCounter} from "../ui/char-counter.tsx"
import {MetaBadge, MetaField} from "../ui/meta.tsx"
import {PriceInput} from "../ui/price-input.tsx"

function formatUpdatedDate(value: unknown): string {
    if (!value || value === "—") return "—";
    const text = String(value);
    const parsed = Date.parse(text);
    if (Number.isNaN(parsed)) return text;
    return new Date(parsed).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function GeneralInfoSection({
                                       name,
                                       onNameChange,
                                       sku,
                                       updated,
                                       variantsCount,
                                       category,
                                       onCategoryChange,
                                       basePrice,
                                       onBasePriceChange,
                                   }) {
    const productName = name ?? ""

    return (
        <SectionCard>
            <CardContent className="flex flex-col gap-4 p-4">
                <div className="flex items-center">
                    <SectionTitle as={Label} htmlFor="product-name">
                        Название товара
                    </SectionTitle>
                    <span className="ml-0.5 text-[#FF3B30]">
                        *
                    </span>
                </div>
                <div className="flex flex-col gap-3">
                    <SectionField
                        className="min-w-0 gap-3 dark:bg-[#2C2C2E] dark:focus-within:border-[#0A84FF]/40 dark:focus-within:bg-[#3A3A3C]">
                        <Input
                            id="product-name"
                            required
                            className="h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-[20px] font-semibold leading-none  text-[#1C1C1E] shadow-none placeholder:text-[#AEAEB2] focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0 dark:text-white"
                            placeholder="Например, Фикус Литара"
                            value={productName}
                            maxLength={MAX_NAME_LENGTH}
                            onChange={(event) => onNameChange(event.target.value)}
                        />
                    </SectionField>
                    <CharCounter
                        className={"ml-auto"}
                        current={productName.length}
                        max={MAX_NAME_LENGTH}
                    />
                </div>

                <div
                    className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#E5E5EA] pt-3 dark:border-[#38383A]">
                    <MetaField label="Артикул" value={sku || "Автоматически"} strong/>

                    <MetaField
                        label="Обновлён"
                        value={formatUpdatedDate(updated)}
                    />

                    <MetaBadge label="Вариантов" value={variantsCount}/>

                    <CategorySelect
                        value={category}
                        options={CATEGORIES}
                        onChange={onCategoryChange}
                    />

                    <PriceInput
                        label="Базовая цена"
                        required
                        value={basePrice}
                        onChange={onBasePriceChange}
                        wrapperClassName="w-28"
                    />
                </div>
            </CardContent>
        </SectionCard>
    )
}
