import {useEffect, useRef} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "../../../../shared/components/ui/Button.jsx";
import {EmptyState} from "../../../../shared/components/ui/EmptyState.jsx";
import {ProductRow} from "./ProductRow.jsx";

export function GoodsTable({
                               products,
                               selectedIds,
                               onToggleProduct,
                               onTogglePage,
                               page,
                               pageSize,
                               totalCount,
                               totalPages,
                               onPageChange,
                           }) {
    const selectPageRef = useRef(null);
    const selectedOnPage = products.filter(product => selectedIds.has(product.id)).length;
    const allOnPageSelected = products.length > 0 && selectedOnPage === products.length;
    const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;
    const firstVisible = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
    const lastVisible = Math.min(page * pageSize, totalCount);

    useEffect(() => {
        if (selectPageRef.current) {
            selectPageRef.current.indeterminate = someOnPageSelected;
        }
    }, [someOnPageSelected]);

    return (
        <section aria-label="Каталог товаров"
                 className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-950/[0.02]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left">
                    <thead className="bg-zinc-50 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    <tr>
                        <th scope="col" className="w-12 px-4 py-3">
                            <input
                                ref={selectPageRef}
                                type="checkbox"
                                aria-label="Выбрать товары на этой странице"
                                checked={allOnPageSelected}
                                disabled={products.length === 0}
                                onChange={onTogglePage}
                                className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                            />
                        </th>
                        <th scope="col" className="px-3 py-3">Товар</th>
                        <th scope="col" className="px-3 py-3">Категория</th>
                        <th scope="col" className="px-3 py-3 text-right">Цена</th>
                        <th scope="col" className="px-3 py-3 text-right">Остаток</th>
                        <th scope="col" className="px-3 py-3">Варианты</th>
                        <th scope="col" className="px-3 py-3">Статус</th>
                        <th scope="col" className="px-4 py-3">Обновлён</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length > 0 ? products.map(product => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            selected={selectedIds.has(product.id)}
                            onToggle={onToggleProduct}
                        />
                    )) : (
                        <tr>
                            <td colSpan={8}>
                                <EmptyState
                                    title="Ничего не найдено"
                                    description="Попробуйте изменить фильтр или поисковый запрос."
                                    className="py-12"
                                />
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <footer
                className="flex flex-col gap-3 border-t border-zinc-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-500" aria-live="polite">
                    Показано {firstVisible}–{lastVisible} из {totalCount}
                </p>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm tabular-nums text-zinc-500">
                        Страница {totalCount === 0 ? 0 : page} из {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            className="min-h-9 px-2.5"
                            aria-label="Предыдущая страница"
                            disabled={page <= 1 || totalCount === 0}
                            onClick={() => onPageChange(page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true"/>
                        </Button>
                        <Button
                            variant="ghost"
                            className="min-h-9 px-2.5"
                            aria-label="Следующая страница"
                            disabled={page >= totalPages || totalCount === 0}
                            onClick={() => onPageChange(page + 1)}
                        >
                            <ChevronRight className="h-4 w-4" aria-hidden="true"/>
                        </Button>
                    </div>
                </div>
            </footer>
        </section>
    );
}