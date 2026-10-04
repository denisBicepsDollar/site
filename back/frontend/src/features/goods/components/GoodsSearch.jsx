import {Search, X} from "lucide-react";

/* Поиск по названию и артикулу.
   Когда поиск понадобится ещё одной фиче — переезжает в shared/components. */
export function GoodsSearch({value, onChange}) {
    return (
        <label className="flex w-55 cursor-text flex-row items-center rounded-xl border-2 border-border2
                          p-2 transition-all duration-200
                          focus-within:shadow-md focus-within:shadow-blue-600/20">
            <Search aria-hidden="true" className="mr-2 h-5 w-5"/>

            <input
                type="text"
                className="w-full bg-transparent outline-none"
                placeholder="Название, артикул..."
                value={value}
                onChange={event => onChange(event.target.value)}
            />

            <button
                type="button"
                aria-label="Очистить поиск"
                onClick={() => onChange('')}
                className={`flex h-7 w-7 items-center justify-center rounded-full p-1 transition-all
                            duration-200 hover:bg-muted/20 hover:brightness-110 active:scale-98
                            ${value ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                <X className="h-5 w-5"/>
            </button>
        </label>
    );
}
