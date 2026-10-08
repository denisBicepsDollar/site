import {Label} from "@/components/ui/label.jsx"
import {Textarea} from "@/components/ui/textarea.jsx"
import {MAX_DESCRIPTION_LENGTH} from "../constants.js"
import {CharCounter} from "../ui/CharCounter.jsx"
import {Card, CardContent} from "@/components/ui/card.jsx"

export function DescriptionSection({description, onDescriptionChange}) {
    const currentDescription = description ?? ""

    return (
        <Card
            className="rounded-[18px] border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#1C1C1E]">
            <CardContent className="flex flex-col gap-3 p-4">
                <Label
                    htmlFor="product-description"
                    className="text-xs font-semibold tracking-wide text-[#6E6E73] uppercase dark:text-[#AEAEB2]"
                >
                    Описание
                </Label>

                <Textarea
                    id="product-description"
                    className="min-h-[132px] resize-none rounded-[14px] border-black/[0.06] bg-[#F2F2F7] px-3 py-3 text-sm leading-relaxed text-[#1C1C1E] shadow-none placeholder:text-[#AEAEB2] focus-visible:border-[#007AFF]/35 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#007AFF]/15 dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:text-white dark:focus-visible:border-[#0A84FF]/40 dark:focus-visible:bg-[#3A3A3C] dark:focus-visible:ring-[#0A84FF]/20"
                    value={currentDescription}
                    placeholder="Введите описание товара..."
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={(event) =>
                        onDescriptionChange(event.target.value)
                    }
                />

                <CharCounter
                    current={currentDescription.length}
                    max={MAX_DESCRIPTION_LENGTH}
                    className="ml-auto"
                />
            </CardContent>
        </Card>
    )
}