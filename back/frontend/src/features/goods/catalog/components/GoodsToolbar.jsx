import {Download, Plus, Search, X} from "lucide-react";
import {useId} from "react";
import {Button} from "../../../../shared/components/ui/Button.jsx";
import {CATALOG_STATUS_FILTERS} from "../model/catalog.js";

export function GoodsToolbar({
                                 status,
                                 onStatusChange,
                                 counts,
                                 query,
                                 onQueryChange,
                                 onExport,
                                 exportDisabled = false,
                             }) {
    const searchId = useId();

    return (
        <section className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"
                 aria-label="Фильтры каталога">
            <div className="flex min-w-0 flex-wrap items-center gap-1 rounded-2xl border border-zinc-200 bg-white p-1">
                {CATALOG_STATUS_FILTERS.map(({value, label}) => {
                    const selected = status === value;
                    const count = value === "all" ? counts.all : counts[value];

                    return (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onStatusChange(value)}
                            className={`inline-flex min-h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                selected ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                            }`}
                        >
                            <span>{label}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                                selected ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-500"
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
                    <label htmlFor={searchId} className="sr-only">Поиск по названию, артикулу или категории</label>
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        aria-hidden="true"/>
                    <input
                        id={searchId}
                        type="search"
                        value={query}
                        onChange={event => onQueryChange(event.target.value)}
                        placeholder="Найти товар..."
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-9 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Очистить поиск"
                            onClick={() => onQueryChange("")}
                            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                        >
                            <X className="h-4 w-4" aria-hidden="true"/>
                        </button>
                    )}
                </div>

                <Button onClick={onExport} disabled={exportDisabled}
                        title="Выгрузить выбранные товары или весь отфильтрованный список">
                    <Download className="h-4 w-4" aria-hidden="true"/>
                    <span>Экспорт</span>
                </Button>
                <Button
                    variant="accent"
                    disabled
                    title="Форма добавления появится после подключения API каталога"
                >
                    <Plus className="h-4 w-4" aria-hidden="true"/>
                    <span>Добавить товар</span>
                </Button>
            </div>
        </section>
    );
}