export function CharCounter({current, max, className = ""}) {
    return (
        <span
            className={`shrink-0 text-[11px] items- font-medium tabular-nums text-[#8E8E93] dark:text-[#98989D] ${className}`}
        >
            {current} / {max}
        </span>
    )
}