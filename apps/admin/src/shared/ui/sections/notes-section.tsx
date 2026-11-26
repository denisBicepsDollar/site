import {useState} from "react"
import {ChevronDown, FileText} from "lucide-react"

import {Button} from "@site/ui/button"
import {CardContent} from "@site/ui/card"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/ui/layout/collapsible.tsx"
import {Label} from "@site/ui/label"
import {SectionCard} from "@/shared/ui/sections/section-card.tsx"
import {SectionTitle} from "@/shared/ui/sections/section-title.tsx"
import {SectionTextarea} from "@/shared/ui/sections/section-textarea.tsx"

import {CharCounter} from "../forms/char-counter.tsx"

export function NotesSection({note, onNoteChange, MAX_NOTE_LENGTH = 100}) {
    const [isOpen, setIsOpen] = useState(true)
    const currentNote = note ?? ""

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SectionCard>
                <CardContent className="p-4">
                    <CollapsibleTrigger render={
                        <Button
                            type="button"
                            variant="ghost"
                            className="border-transparent  px-1 h-8 "
                        >
                            <ChevronDown
                                aria-hidden="true"
                                className={`size-4 shrink-0 text-[#8E8E93] transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                            <SectionTitle>Заметки</SectionTitle>
                        </Button>
                    }>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pt-3">
                        <div className="flex flex-col gap-3">
                            <Label
                                htmlFor="product-note"
                                className=""
                            >
                                <FileText
                                    aria-hidden="true"
                                    className="size-4 text-[#8E8E93]"
                                />
                                Внутренняя заметка
                            </Label>

                            <SectionTextarea

                                id="product-note"
                                className="min-h-[140px]"
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