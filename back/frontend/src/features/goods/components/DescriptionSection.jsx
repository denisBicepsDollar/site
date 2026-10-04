import {MAX_DESCRIPTION_LENGTH} from "../constants.js";
import {CharCounter} from "../ui/CharCounter.jsx";

/* Секция 2. Описание товара для витрины */
export function DescriptionSection({description, onDescriptionChange}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <span className="flex text-xs font-semibold uppercase text-zinc-500">
                Описание
            </span>

            <label className="group flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3
                              transition-all focus-within:border-zinc-900 focus-within:bg-white
                              focus-within:ring-1 focus-within:ring-zinc-900">
                <textarea
                    className="min-h-[120px] w-full resize-none bg-transparent text-sm font-medium
                               leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-300"
                    value={description}
                    placeholder="Введите описание товара..."
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={event => onDescriptionChange(event.target.value)}
                />
                <CharCounter current={description.length} max={MAX_DESCRIPTION_LENGTH} className="ml-auto"/>
            </label>
        </div>
    );
}