/* Счётчик символов под/рядом с полем ввода: «12 / 100» */
export function CharCounter({current, max, className = ""}) {
    return (
        <span className={`shrink-0 text-xs tabular-nums text-zinc-400 ${className}`}>
            {current} / {max}
        </span>
    );
}
