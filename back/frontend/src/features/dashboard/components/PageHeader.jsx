export function PageHeader({title, description, eyebrow = "Управление магазином", actions}) {
    return (
        <header
            className="flex flex-col gap-4 border-b border-zinc-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {eyebrow}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                    {title}
                </h1>
                {description && <p className="mt-1.5 max-w-2xl text-sm text-zinc-500 sm:text-base">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
    );
}