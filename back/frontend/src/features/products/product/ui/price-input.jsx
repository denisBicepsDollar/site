import {useId} from "react"
import {Input} from "@/shared/ui/forms/input.jsx"
import {cn} from "@/shared/lib/utils"

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
        <div className="flex min-w-0 items-center justify-between gap-3">
            {label && (
                <label
                    htmlFor={inputId}
                    className="shrink-0 text-sm font-semibold text-[#8E8E93] dark:text-[#98989D] select-none"
                >
                    {label}
                    {required && (
                        <span className="ml-0.5 text-[#FF3B30]">*</span>
                    )}
                </label>
            )}

            <div
                className={cn(
                    "flex h-[40px] w-full items-center justify-end gap-1 rounded-full px-3",
                    "border border-black/[0.06] bg-[#F2F2F7]",
                    "transition-all duration-200",
                    "focus-within:border-[#007AFF]/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#007AFF]/15",
                    "dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:focus-within:bg-[#2C2C2E] dark:focus-within:ring-[#0A84FF]/20",
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
                        "h-full w-full min-w-0 rounded-none border-0 bg-transparent px-0 py-0 text-right text-sm font-semibold tabular-nums text-[#1C1C1E] shadow-none focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0 dark:text-white",
                        inputClassName,
                    )}
                    placeholder="0"
                    value={value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                />

                <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-bold text-[#8E8E93] dark:text-[#98989D] select-none"
                >
                    ₽
                </span>
            </div>
        </div>
    )
}