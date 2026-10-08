import {useState} from "react"
import {ChevronDown, FileText} from "lucide-react"

import {Button} from "@/components/ui/button.jsx"
import {CardContent} from "@/components/ui/card.jsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx"
import {Label} from "@/components/ui/label.jsx"
import {SectionCard} from "@/components/ui/section-card.jsx"
import {SectionTitle} from "@/components/ui/section-title.jsx"
import {SectionTextarea} from "@/components/ui/section-textarea.jsx"

import {CharCounter} from "../../features/goods/product/ui/CharCounter.jsx"

export function NotesSection({note, onNoteChange, MAX_NOTE_LENGTH}) {
    const [isOpen, setIsOpen] = useState(true)
    const currentNote = note ?? ""

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SectionCard>
                <CardContent className="p-4">
                    <CollapsibleTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-9 w-full justify-start gap-2 rounded-[12px] px-2 text-left text-[#1C1C1E] hover:bg-[#F2F2F7] dark:text-white dark:hover:bg-[#2C2C2E]"
                        >
                            <ChevronDown
                                aria-hidden="true"
                                className={`size-4 shrink-0 text-[#8E8E93] transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                            <SectionTitle>Заметки</SectionTitle>
                        </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pt-3">
                        <div className="flex flex-col gap-3">
                            <Label
                                htmlFor="product-note"
                                className="flex items-center gap-2 text-[13px] font-medium text-[#1C1C1E] dark:text-[#F2F2F7]"
                            >
                                <FileText
                                    aria-hidden="true"
                                    className="size-4 text-[#8E8E93]"
                                />
                                Внутренняя заметка
                            </Label>

                            <SectionTextarea
                                id="product-note"
                                className="min-h-[100px]"
                                value={currentNote}
                                placeholder="Для себя..."
                                maxLength={MAX_NOTE_LENGTH}
                                onChange={(event) =>
                                    onNoteChange(event.target.value)
                                }
                            />

                            <CharCounter
                                current={currentNote.length}
                                max={MAX_NOTE_LENGTH}
                                className="ml-auto"
                            />
                        </div>
                    </CollapsibleContent>
                </CardContent>
            </SectionCard>
        </Collapsible>
    )
}