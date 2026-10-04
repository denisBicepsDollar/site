/* Мелкие элементы строки метаданных товара:
   «Артикул: PL-002» и вертикальный разделитель между ними. */

export function MetaField({label, value, strong = false}) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">{label}:</span>
            <span className={strong ? "font-semibold text-zinc-900" : "font-medium text-zinc-900"}>
                {value}
            </span>
        </div>
    );
}

export function MetaDivider() {
    return <div className="h-5 w-px bg-zinc-200"/>;
}

export function MetaBadge({label, value}) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">{label}:</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full
                             bg-zinc-900 px-1.5 text-xs font-bold text-white">
                {value}
            </span>
        </div>
    );
}
