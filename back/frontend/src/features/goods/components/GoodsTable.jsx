import {goodsList} from "../mocks/goodsList.js";
import {useGoodsTable} from "../model/useGoodsTable.js";
import {GoodsTableHeader} from "./GoodsTableHeader.jsx";
import {GoodsTableRow} from "./GoodsTableRow.jsx";
import {GoodsPagination} from "./GoodsPagination.jsx";
import {GoodsSelectionBar} from "./GoodsSelectionBar.jsx";

/* Таблица товаров: состояние в useGoodsTable, разметка — в подкомпонентах.
   Список берём из мока; когда появится API, сюда придёт props со списком. */
export function GoodsTable({status, query}) {
    const table = useGoodsTable(goodsList, {status, query});

    return (
        <div>
            <div className="mt-4 flex flex-col overflow-hidden rounded-lg border-2 border-stone-200 bg-stone-200">
                <GoodsTableHeader
                    isAllSelected={table.isAllSelected}
                    onToggleAll={table.toggleAll}
                />

                <div className="flex w-full flex-col justify-baseline gap-0.5">
                    {table.items.map(item => (
                        <GoodsTableRow
                            key={item.id}
                            item={item}
                            isSelected={table.selectedIds.includes(item.id)}
                            onToggle={() => table.toggleOne(item.id)}
                        />
                    ))}

                    <GoodsPagination
                        page={table.page}
                        totalPages={table.totalPages}
                        shownCount={Math.min(table.indexOfLastItem, table.totalCount)}
                        totalCount={table.totalCount}
                        onPrev={table.goToPrevPage}
                        onNext={table.goToNextPage}
                    />
                </div>
            </div>

            <GoodsSelectionBar
                selectedIds={table.selectedIds}
                statuses={table.statuses}
                onClear={table.clearSelection}
            />
        </div>
    );
}
