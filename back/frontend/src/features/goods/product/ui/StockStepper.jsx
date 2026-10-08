import {useEffect, useState} from "react"
import {Minus, Plus} from "lucide-react"

import {Button} from "@/components/ui/button.jsx"
import {Input} from "@/components/ui/input.jsx"
import {cn} from "cn"

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

        // Даём временно очистить поле, чтобы заменить число целиком.
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
        "size-7 shrink-0 rounded-full p-0 text-[#007AFF] hover:bg-white active:scale-95 disabled:opacity-35 dark:text-[#0A84FF] dark:hover:bg-[#2C2C2E]"

    return (
        <div
            className={cn(
                "inline-flex min-h-10 w-fit items-center justify-between gap-1 rounded-full border border-black/[0.06] bg-[#F2F2F7] p-1 transition-colors focus-within:border-[#007AFF]/30 focus-within:ring-4 focus-within:ring-[#007AFF]/15 dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:focus-within:border-[#0A84FF]/35 dark:focus-within:ring-[#0A84FF]/20",
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
                <Minus aria-hidden="true" className="size-4" strokeWidth={1.8}/>
            </Button>

            <Input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                aria-label="Остаток товара"
                className="h-7 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-center text-base font-semibold tabular-nums shadow-none [appearance:textfield] focus-visible:border-0 focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none md:text-sm"
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
                <Plus aria-hidden="true" className="size-4" strokeWidth={1.8}/>
            </Button>
        </div>
    )
}