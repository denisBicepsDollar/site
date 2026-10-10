import {CardContent} from "@/shared/ui/display/card.jsx"
import {Input} from "@/shared/ui/forms/input.jsx"
import {Label} from "@/shared/ui/forms/label.jsx"
import {SectionCard} from "@/shared/ui/sections/section-card.jsx"
import {SectionTitle} from "@/shared/ui/sections/section-title.jsx"
import {SectionField} from "@/shared/ui/sections/section-field.jsx"

import {CATEGORIES, MAX_NAME_LENGTH} from "../constants.js"
import {CategorySelect} from "../ui/category-select.jsx"
import {CharCounter} from "../ui/char-counter.jsx"
import {MetaBadge, MetaDivider, MetaField} from "../ui/meta.jsx"
import {PriceInput} from "../ui/price-input.jsx"

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
                            className="h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-[20px] font-semibold leading-none tracking-tight text-[#1C1C1E] shadow-none placeholder:text-[#AEAEB2] focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0 dark:text-white"
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
                    <MetaField label="Артикул" value={sku} strong/>

                    <MetaField
                        label="Обновлён"
                        value={String(updated).toLowerCase()}
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
                        wrapperClassName="w-24" /* Управляет шириной серой капсулы */
                    />
                </div>
            </CardContent>
        </SectionCard>
    )
}