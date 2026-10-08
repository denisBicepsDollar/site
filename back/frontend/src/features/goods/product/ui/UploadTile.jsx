import {Plus} from "lucide-react"
import {cn} from "cn"
import {SIZES} from "../constants.js"
import {Input} from "@/components/ui/input.jsx";

export function UploadTile({onFiles, className = "", size}) {
    const handleChange = (event) => {
        const files = Array.from(event.target.files ?? [])
        event.target.value = ""

        if (files.length) onFiles(files)
    }

    const {wrapper = ""} = SIZES[size] ?? {}

    return (
        <label
            className={cn(
                "group flex shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[16px] border border-dashed border-[#D1D1D6] bg-white/70 text-[#6E6E73] transition-all duration-200 hover:border-[#007AFF]/40 hover:bg-[#007AFF]/[0.04] active:scale-[0.98] has-[:focus-visible]:border-[#007AFF] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#007AFF]/15 dark:border-[#48484A] dark:bg-[#1C1C1E] dark:text-[#AEAEB2] dark:hover:border-[#0A84FF]/40 dark:hover:bg-[#0A84FF]/[0.06]",
                wrapper,
                className,
            )}
        >
            <Plus
                aria-hidden="true"
                className="size-4 text-[#007AFF] transition-transform group-hover:scale-110 dark:text-[#0A84FF]"
            />
            <span className="text-[10px] font-semibold tracking-[0.08em] uppercase">
                Фото
            </span>

            <Input
                type="file"
                accept="image/*"
                multiple
                aria-label="Загрузить фото"
                className="sr-only"
                onChange={handleChange}
            />
        </label>
    )
}