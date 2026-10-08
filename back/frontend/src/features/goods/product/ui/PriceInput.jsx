import {useId} from "react"
import {Input} from "@/components/ui/input.jsx"
import {cn} from "cn"
import {SectionField} from "@/components/ui/section-field.jsx"

export function PriceInput({
                               value,
                               onChange,
                               label,
                               required = false,
                               wrapperClassName = "",
                               inputClassName = "",
                           }) {
    const inputId = useId()

    return (
        <SectionField className="flex min-w-0 items-center gap-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="shrink-0 text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]"
                >
                    {label}
                    {required && (
                        <span className="ml-0.5 text-[#FF3B30]">*</span>
                    )}
                </label>
            )}

            <SectionField
                className={cn(
                    "h-11 min-w-[120px] gap-2 shadow-sm dark:bg-[#1C1C1E] dark:focus-within:bg-[#2C2C2E]",
                    wrapperClassName,
                )}
            >
                <Input
                    id={inputId}
                    type="number"
                    min="0"
                    step="1"
                    required={required}
                    aria-label={label || "Цена в рублях"}
                    className={cn(
                        "h-full min-w-0 rounded-none border-0 bg-transparent px-0 py-0 text-right text-base font-semibold tabular-nums text-[#1C1C1E] shadow-none focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0 md:text-sm dark:text-white",
                        inputClassName,
                    )}
                    placeholder="0"
                    value={value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                />

                <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-medium text-[#8E8E93] dark:text-[#98989D]"
                >
                    ₽
                </span>
            </SectionField>
        </SectionField>
    )
}