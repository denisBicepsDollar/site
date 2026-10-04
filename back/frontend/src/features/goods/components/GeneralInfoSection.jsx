import {CATEGORIES, MAX_NAME_LENGTH} from "../constants.js";
import {CategorySelect} from "../ui/CategorySelect.jsx";
import {CharCounter} from "../ui/CharCounter.jsx";
import {MetaBadge, MetaDivider, MetaField} from "../ui/Meta.jsx";
import {PriceInput} from "../ui/PriceInput.jsx";

/* Секция 1. Название товара + строка метаданных:
   артикул, дата обновления, количество вариантов, категория, базовая цена. */
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
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex gap-2">
                <span className="text-xs font-semibold uppercase text-zinc-500">
                    Название товара
                </span>
                <span className="text-[10px] font-medium text-red-500">*</span>
            </div>

            <label className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50
                              p-3 transition-all focus-within:border-zinc-900 focus-within:bg-white
                              focus-within:ring-1 focus-within:ring-zinc-900">
                <input
                    className="flex-1 bg-transparent text-[22px] font-medium leading-none text-zinc-900
                               placeholder:text-zinc-300 focus:outline-none"
                    placeholder="Например, Фикус Литара"
                    value={name}
                    maxLength={MAX_NAME_LENGTH}
                    onChange={event => onNameChange(event.target.value)}
                />
                <CharCounter current={name.length} max={MAX_NAME_LENGTH}/>
            </label>

            <div className="flex flex-wrap justify-between gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    <MetaField label="Артикул" value={sku} strong/>
                    <MetaDivider/>

                    <MetaField label="Обновлен" value={String(updated).toLowerCase()}/>
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
            </div>
        </div>
    );
}