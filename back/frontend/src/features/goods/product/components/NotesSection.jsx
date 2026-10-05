import {useState} from "react";
import {ChevronDown, File} from "lucide-react";
import {MAX_NOTE_LENGTH} from "../constants.js";
import {CharCounter} from "../ui/CharCounter.jsx";

/* Секция «Заметки» (правый сайдбар) — сворачиваемая.
   Открыта/закрыта — локальное состояние блока. */
export function NotesSection({note, onNoteChange}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4">
            <button
                type="button"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                onClick={() => setIsOpen(prev => !prev)}>
                <ChevronDown
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
                <span className="text-xs font-semibold uppercase text-zinc-500">
                    Заметки
                </span>
            </button>

            <div className={`grid transition-all duration-200 ease-in-out
                             ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-900">
                            <File className="flex h-5 w-5 whitespace-nowrap" aria-hidden="true"/>
                            Внутренняя заметка
                        </div>

                        <label className="group flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3
                                          transition-all focus-within:border-zinc-900 focus-within:bg-white
                                          focus-within:ring-1 focus-within:ring-zinc-900">
                            <textarea
                                className="min-h-[100px] w-full resize-none bg-transparent text-sm font-medium
                                           leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-300"
                                value={note}
                                placeholder="Для себя..."
                                maxLength={MAX_NOTE_LENGTH}
                                onChange={event => onNoteChange(event.target.value)}
                            />
                            <CharCounter current={note.length} max={MAX_NOTE_LENGTH} className="ml-auto"/>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}