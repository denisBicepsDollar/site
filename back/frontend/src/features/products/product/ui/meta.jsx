import {Badge} from "@/shared/ui/display/badge.jsx"
import {Separator} from "@/shared/ui/display/separator.jsx"

export function MetaField({label, value, strong = false}) {
    return (
        <div className="flex items-center gap-1.5 text-sm">
            <span className="text-[#8E8E93] dark:text-[#98989D]">
                {label}:
            </span>

            <span
                className={
                    strong
                        ? "font-semibold text-[#1C1C1E] dark:text-white"
                        : "font-medium text-[#1C1C1E] dark:text-[#F2F2F7]"
                }
            >
                {value}
            </span>
        </div>
    )
}

export function MetaDivider() {
    return (
        <Separator
            orientation="vertical"
            className="mx-1 h-4 self-center bg-[#E5E5EA] dark:bg-[#38383A]"
        />
    )
}

export function MetaBadge({label, value}) {
    return (
        <div className="flex items-center gap-1.5 text-sm">
            <span className="text-[#8E8E93] dark:text-[#98989D]">
                {label}:
            </span>

            <Badge
                variant="default"
                className="min-w-6 justify-center text-sm rounded-full px-2 tabular-nums"
            >
                {value}
            </Badge>
        </div>
    )
}