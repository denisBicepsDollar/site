import {Plus} from "lucide-react"
import {cn} from "@/shared/lib/utils" // ИСПРАВЛЕНО: Правильный импорт cn

export function UploadTile({onFiles, className = ""}) {
    const handleChange = (event) => {
        const files = Array.from(event.target.files ?? [])
        event.target.value = ""

        if (files.length) onFiles(files)
    }


    return (
        <label
            className={cn(
                "group flex shrink-0 cursor-pointer flex-col items-center justify-center gap-1",
                "border border-dashed border-[#D1D1D6] dark:border-[#48484A]",
                "bg-white/70 dark:bg-[#1C1C1E] text-[#8E8E93] dark:text-[#AEAEB2]",
                "transition-all duration-200 active:scale-[0.95]",
                "hover:border-[#007AFF]/40 hover:bg-[#007AFF]/[0.04]",
                "dark:hover:border-[#0A84FF]/40 dark:hover:bg-[#0A84FF]/[0.06] rounded-xl h-28 w-28",
                className,
            )}
        >
            <Plus
                aria-hidden="true"
                className="h-5 w-5 text-[#007AFF] transition-transform group-hover:scale-110 dark:text-[#0A84FF]"
            />
            <span className="text-[9px] font-bold uppercase tracking-wider">
                Фото
            </span>

            <input
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