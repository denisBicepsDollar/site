import {useEffect, useState} from "react"
import {Minus, Plus} from "lucide-react"
import {Button} from "@/shared/ui/actions/button.jsx"
import {Input} from "@/shared/ui/forms/input.jsx"
import {cn} from "@/shared/lib/utils" // ИСПРАВЛЕНО: Правильный импорт cn

export function StockStepper({value, onChange, className = ""}) {
    const numericValue = Math.max(0, Math.trunc(Number(value) || 0))
    const [draft, setDraft] = useState(String(numericValue))

    useEffect(() => {
        setDraft(String(numericValue))
    }, [numericValue])

    const step = (delta) => {
        const nextValue = Math.max(0, numericValue + delta)
        setDraft(String(nextValue))
        onChange(nextValue)
    }

    const handleChange = (event) => {
        const rawValue = event.target.value
        setDraft(rawValue)

        if (rawValue === "") return

        const parsedValue = Number(rawValue)
        if (!Number.isFinite(parsedValue)) return

        onChange(Math.max(0, Math.trunc(parsedValue)))
    }

    const handleBlur = () => {
        const nextValue = Math.max(0, Math.trunc(Number(draft) || 0))
        setDraft(String(nextValue))

        if (nextValue !== numericValue) {
            onChange(nextValue)
        }
    }

    const stepButtonClass =
        "size-7 shrink-0 border-transparent rounded-full p-0 text-[#007AFF] hover:bg-black/5 active:scale-90 disabled:opacity-30 dark:text-[#0A84FF] dark:hover:bg-white/10 transition-all"

    return (
        <div
            className={cn(
                "inline-flex h-9 w-full items-center justify-between gap-0.5 rounded-full",
                "border border-black/[0.06] bg-[#F2F2F7] px-1",
                "transition-all duration-200",
                "focus-within:border-[#007AFF]/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#007AFF]/15",
                "dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:focus-within:bg-[#2C2C2E] dark:focus-within:ring-[#0A84FF]/20",
                className,
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Уменьшить остаток"
                onClick={() => step(-1)}
                disabled={numericValue <= 0}
                className={stepButtonClass}
            >
                <Minus aria-hidden="true" className="size-3.5" strokeWidth={2.2}/>
            </Button>

            <Input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                aria-label="Остаток товара"
                className="
                    h-7 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0
                    text-center text-sm font-semibold tabular-nums text-[#1C1C1E] dark:text-white
                    shadow-none [appearance:textfield]
                    focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0
                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                "
                value={draft}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Увеличить остаток"
                onClick={() => step(1)}
                className={stepButtonClass}
            >
                <Plus aria-hidden="true" className="size-3.5" strokeWidth={2.2}/>
            </Button>
        </div>
    )
}