import {useState} from "react"
import {ChevronDown, FileText} from "lucide-react"

import {Button} from "@/components/ui/button.jsx"
import {Card, CardContent} from "@/components/ui/card.jsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx"
import {Label} from "@/components/ui/label.jsx"
import {Textarea} from "@/components/ui/textarea.jsx"

import {CharCounter} from "../../features/goods/product/ui/CharCounter.jsx"

export function NotesSection({note, onNoteChange, MAX_NOTE_LENGTH}) {
    const [isOpen, setIsOpen] = useState(true)
    const currentNote = note ?? ""

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card
                className="rounded-[18px] border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#1C1C1E]">
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
                            <span
                                className="text-xs font-semibold tracking-wide text-[#6E6E73] uppercase dark:text-[#AEAEB2]">
                                Заметки
                            </span>
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

                            <Textarea
                                id="product-note"
                                className="min-h-[100px] resize-none rounded-[14px] border-black/[0.06] bg-[#F2F2F7] px-3 py-3 text-sm leading-relaxed text-[#1C1C1E] shadow-none placeholder:text-[#AEAEB2] focus-visible:border-[#007AFF]/35 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#007AFF]/15 dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:text-white dark:focus-visible:border-[#0A84FF]/40 dark:focus-visible:bg-[#3A3A3C] dark:focus-visible:ring-[#0A84FF]/20"
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
            </Card>
        </Collapsible>
    )
}