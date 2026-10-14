export function SummaryRow({label, value, strong = false}) {
    return (
        <div
            className={`flex items-center justify-between gap-4 ${
                strong
                    ? "text-sm font-semibold text-[#1C1C1E] dark:text-white"
                    : "text-[13px] text-[#6E6E73] dark:text-[#AEAEB2]"
            }`}
        >
            <span>{label}</span>
            <span className="shrink-0 tabular-nums">{value}</span>
        </div>
    )
}