import {CardContent} from "@/components/ui/card.jsx"
import {Input} from "@/components/ui/input.jsx"
import {Label} from "@/components/ui/label.jsx"
import {SectionCard} from "@/components/ui/section-card.jsx"
import {SectionTitle} from "@/components/ui/section-title.jsx"

import {CATEGORIES, MAX_NAME_LENGTH} from "../constants.js"
import {CategorySelect} from "../ui/CategorySelect.jsx"
import {CharCounter} from "../ui/CharCounter.jsx"
import {MetaBadge, MetaDivider, MetaField} from "../ui/Meta.jsx"
import {PriceInput} from "../ui/PriceInput.jsx"

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
                <div className="flex items-center gap-2">
                    <SectionTitle as={Label} htmlFor="product-name">
                        Название товара
                    </SectionTitle>
                    <span className="text-[10px] font-medium text-[#FF3B30]">
                        *
                    </span>
                </div>

                <div
                    className="flex min-w-0 items-center gap-3 rounded-[14px] border border-black/[0.06] bg-[#F2F2F7] px-3 transition-all focus-within:border-[#007AFF]/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#007AFF]/15 dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:focus-within:border-[#0A84FF]/40 dark:focus-within:bg-[#3A3A3C] dark:focus-within:ring-[#0A84FF]/20">
                    <Input
                        id="product-name"
                        required
                        className="h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-[20px] font-semibold leading-none tracking-tight text-[#1C1C1E] shadow-none placeholder:text-[#AEAEB2] focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0 dark:text-white"
                        placeholder="Например, Фикус Литара"
                        value={productName}
                        maxLength={MAX_NAME_LENGTH}
                        onChange={(event) => onNameChange(event.target.value)}
                    />

                    <CharCounter
                        current={productName.length}
                        max={MAX_NAME_LENGTH}
                    />
                </div>

                <div
                    className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#E5E5EA] pt-3 dark:border-[#38383A]">
                    <MetaField label="Артикул" value={sku} strong/>
                    <MetaDivider/>

                    <MetaField
                        label="Обновлён"
                        value={String(updated).toLowerCase()}
                    />
                    <MetaDivider/>

                    <MetaBadge label="Вариантов" value={variantsCount}/>
                    <MetaDivider/>

                    <CategorySelect
                        value={category}
                        options={CATEGORIES}
                        onChange={onCategoryChange}
                    />
                    <MetaDivider/>

                    <PriceInput
                        label="Базовая цена"
                        required
                        value={basePrice}
                        onChange={onBasePriceChange}
                        inputClassName="w-28"
                    />
                </div>
            </CardContent>
        </SectionCard>
    )
}