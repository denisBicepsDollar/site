import {Check, Database} from "lucide-react";
import {useMemo, useState} from "react";
import {Button} from "../../../shared/components/ui/Button.jsx";
import {PageHeader} from "../../dashboard/components/PageHeader.jsx";
import {products} from "../data/products.js";
import {downloadProductsCsv} from "./model/exportProducts.js";
import {filterProducts, getCatalogSummary, getProductCounts} from "./model/catalog.js";
import {GoodsSummary} from "./components/GoodsSummary.jsx";
import {GoodsTable} from "./components/GoodsTable.jsx";
import {GoodsToolbar} from "./components/GoodsToolbar.jsx";

const PAGE_SIZE = 8;

export function GoodsListPage() {
    const [status, setStatus] = useState("all");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const counts = useMemo(() => getProductCounts(products), []);
    const summary = useMemo(() => getCatalogSummary(products), []);
    const filteredProducts = useMemo(
        () => filterProducts(products, status, query),
        [status, query],
    );
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );
    const selectedProducts = products.filter(product => selectedIds.has(product.id));

    const changeStatus = value => {
        setStatus(value);
        setPage(1);
    };

    const changeQuery = value => {
        setQuery(value);
        setPage(1);
    };

    const toggleProduct = id => {
        setSelectedIds(previous => {
            const next = new Set(previous);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const togglePage = () => {
        const pageIds = pageProducts.map(product => product.id);
        const pageAlreadySelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));

        setSelectedIds(previous => {
            const next = new Set(previous);
            pageIds.forEach(id => pageAlreadySelected ? next.delete(id) : next.add(id));
            return next;
        });
    };

    const exportCatalog = () => {
        downloadProductsCsv(selectedProducts.length > 0 ? selectedProducts : filteredProducts);
    };

    return (
        <div
            className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <PageHeader
                title="Товары"
                description="Каталог, карточки товаров и контроль остатков."
                actions={
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                        <Database className="h-3.5 w-3.5" aria-hidden="true"/>
                        Демо-данные
                    </span>
                }
            />

            <GoodsSummary summary={summary}/>

            <GoodsToolbar
                status={status}
                onStatusChange={changeStatus}
                counts={counts}
                query={query}
                onQueryChange={changeQuery}
                onExport={exportCatalog}
                exportDisabled={filteredProducts.length === 0 && selectedProducts.length === 0}
            />

            {selectedIds.size > 0 && (
                <div role="status"
                     className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
                    <span className="flex items-center gap-2 font-medium">
                        <Check className="h-4 w-4" aria-hidden="true"/>
                        Выбрано товаров: {selectedIds.size}
                    </span>
                    <Button variant="ghost" className="min-h-8 px-2" onClick={() => setSelectedIds(new Set())}>
                        Снять выделение
                    </Button>
                </div>
            )}

            <GoodsTable
                products={pageProducts}
                selectedIds={selectedIds}
                onToggleProduct={toggleProduct}
                onTogglePage={togglePage}
                page={currentPage}
                pageSize={PAGE_SIZE}
                totalCount={filteredProducts.length}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <p className="text-center text-xs text-zinc-400">
                Данные каталога пока демонстрационные; сохранение изменений подключим вместе с API.
            </p>
        </div>
    );
}