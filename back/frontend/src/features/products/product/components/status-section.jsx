import {CardContent} from "@/shared/ui/display/card.jsx"
import {Label} from "@/shared/ui/forms/label.jsx"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/shared/ui/forms/radio-group.jsx"
import {SectionCard} from "@/shared/ui/sections/section-card.jsx"
import {SectionTitle} from "@/shared/ui/sections/section-title.jsx"

import {STATUSES} from "../constants.js"

export function StatusSection({status, onStatusChange}) {
    return (
        <SectionCard>
            <CardContent className="flex flex-col gap-3 p-4">
                <SectionTitle as="h2">Статус</SectionTitle>

                <RadioGroup
                    value={status}
                    onValueChange={onStatusChange}
                    className="flex flex-col gap-2"
                >
                    {STATUSES.map(({value, name, description}, index) => {
                        const isSelected = status === value
                        const id = `product-status-${index}`

                        return (
                            <Label
                                key={value}
                                htmlFor={id}
                                className={`flex cursor-pointer items-start gap-3 rounded-[14px] border p-3 transition-colors ${
                                    isSelected
                                        ? "border-[#007AFF]/30 bg-[#007AFF]/[0.06] dark:border-[#0A84FF]/35 dark:bg-[#0A84FF]/[0.1]"
                                        : "border-black/[0.06] bg-white hover:bg-[#F8F8FA] dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:hover:bg-[#2C2C2E]"
                                }`}
                            >
                                <RadioGroupItem
                                    id={id}
                                    value={value}
                                    className="mt-0.5 border-[#C7C7CC] text-[#007AFF] focus-visible:ring-[#007AFF]/25 dark:border-[#636366] dark:text-[#0A84FF] dark:focus-visible:ring-[#0A84FF]/30"
                                />

                                <span className="flex min-w-0 flex-col gap-0.5">
                                    <span
                                        className={`text-sm ${isSelected ? "font-semibold text-[#1C1C1E] dark:text-white" : "font-medium text-[#6E6E73] dark:text-[#AEAEB2]"}`}>
                                        {name}
                                    </span>
                                    <span className="text-xs leading-relaxed text-[#8E8E93] dark:text-[#98989D]">
                                        {description}
                                    </span>
                                </span>
                            </Label>
                        )
                    })}
                </RadioGroup>
            </CardContent>
        </SectionCard>
    )
}