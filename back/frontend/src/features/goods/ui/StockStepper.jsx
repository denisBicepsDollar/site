import {Minus, Plus} from "lucide-react";

/* Остаток товара: [−] [число] [+] */
export function StockStepper({value, onChange, className = ""}) {
    const step = delta => onChange(Math.max(0, Number(value) + delta));

    return (
        <div className={`flex overflow-hidden rounded-lg border border-zinc-200
                         focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900
                         ${className}`}>
            <button
                type="button"
                aria-label="Уменьшить остаток"
                onClick={() => step(-1)}
                className="flex w-1/3 shrink-0 items-center justify-center border-r border-zinc-200
                           hover:bg-zinc-50 active:scale-95">
                <Minus aria-hidden="true" className="h-5 w-5" strokeWidth={1}/>
            </button>

            <input
                type="number"
                className="w-1/3 bg-transparent text-center text-sm font-medium outline-none"
                value={value}
                onChange={event => onChange(Number(event.target.value))}
            />

            <button
                type="button"
                aria-label="Увеличить остаток"
                onClick={() => step(1)}
                className="flex w-1/3 shrink-0 items-center justify-center border-l border-zinc-200
                           hover:bg-zinc-50 active:scale-95">
                <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={1}/>
            </button>
        </div>
    );
}
