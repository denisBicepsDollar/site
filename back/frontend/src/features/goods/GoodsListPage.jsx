import {useMemo, useState} from "react";
import {PageHeader} from "../dashboard/components/PageHeader.jsx";
import {filterProducts, getProductCounts} from "./catalog/model/catalog.js";
import {GoodsToolbar} from "./catalog/components/GoodsToolbar.jsx";
import {RenderTable} from "../../shared/ui/table/RenderTable.jsx";
import {data} from "../../shared/data.js";

export function GoodsListPage() {
    const [currentStatus, setCurrentStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const counts = useMemo(() => getProductCounts(data), []);
    const filteredProducts = useMemo(
        () => filterProducts(data, currentStatus, searchQuery),
        [currentStatus, searchQuery],
    );
    const lowStock = data.filter(product => product.stock < 5).length;
    const summary = `${data.length} позиций · ${counts.active} активных · ${lowStock} заканчиваются`;

    const productHeaders = [
        {key: 'product', title: 'Товар', className: 'w-1/4'},
        {key: 'category', title: 'Категория', className: 'w-1/4'},
        {key: 'price', title: 'Цена', className: 'w-1/6'},
        {key: 'stock', title: 'Остаток', className: 'w-1/6'},
        {key: 'options', title: 'Варианты', className: 'w-1/6'},
    ];


    return (
        <div className="h-full px-50">
            <PageHeader
                title="Товары"
                description="Каталог, варианты и остатки"
                summary={summary}
            />
            {/*<div className="flex flex-row gap-3 pt-4">*/}
            {/*    <GoodsToolbar*/}
            {/*        currentStatus={currentStatus}*/}
            {/*        setCurrentStatus={setCurrentStatus}*/}
            {/*        counts={counts}*/}
            {/*        searchQuery={searchQuery}*/}
            {/*        setSearchQuery={setSearchQuery}*/}
            {/*    />*/}
            {/*</div>*/}
            <RenderTable
                data={filteredProducts}
                headerTitles={productHeaders}
                currentStatus={'all'}
                searchQuery={''}
            />
        </div>
    );
}