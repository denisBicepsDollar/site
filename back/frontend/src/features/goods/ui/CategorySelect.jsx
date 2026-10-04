import {useState} from "react";
import {Check, ChevronDown} from "lucide-react";

/* Выпадающий список категорий.
   Открыт/закрыт — собственное состояние виджета, страница про это не знает. */
export function CategorySelect({value, options, onChange}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = category => {
        setIsOpen(false);
        onChange(category);
    };

    return (
        <div className="flex items-center gap-2">
            <label className="text-zinc-400">
                Категория:
            </label>

            <div className="relative w-fit">
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200
                               bg-white p-2 text-sm font-medium hover:bg-zinc-50">
                    <span className="truncate">{value}</span>
                    <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                <div className={`absolute left-0 top-full z-20 mt-2 flex max-h-60 w-max min-w-full flex-col
                                 overflow-auto rounded-xl border border-zinc-200 bg-white shadow-lg
                                 transition-all duration-150
                                 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}>
                    {options.map(category => (
                        <button
                            key={category}
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-between p-3 text-left
                                       text-sm hover:bg-zinc-50"
                            onClick={() => handleSelect(category)}>
                            <span className="whitespace-nowrap">{category}</span>
                            <Check
                                aria-hidden="true"
                                className={`h-5 w-5 text-zinc-500 ${category === value ? "opacity-100" : "opacity-0"}`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
