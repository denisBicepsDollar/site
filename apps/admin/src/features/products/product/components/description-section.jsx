import {Label} from "@/shared/ui/forms/label.jsx"
import {MAX_DESCRIPTION_LENGTH} from "../constants.js"
import {CharCounter} from "../ui/char-counter.jsx"
import {CardContent} from "@/shared/ui/display/card.jsx"
import {SectionCard} from "@/shared/ui/sections/section-card.jsx"
import {SectionTitle} from "@/shared/ui/sections/section-title.jsx"
import {SectionTextarea} from "@/shared/ui/sections/section-textarea.jsx"

export function DescriptionSection({description, onDescriptionChange}) {
    const currentDescription = description ?? ""

    return (
        <SectionCard>
            <CardContent className="flex flex-col gap-3 p-4">
                <SectionTitle as={Label} htmlFor="product-description">
                    Описание
                </SectionTitle>

                <SectionTextarea
                    id="product-description"
                    className="min-h-[132px]"
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
        </SectionCard>
    )
}