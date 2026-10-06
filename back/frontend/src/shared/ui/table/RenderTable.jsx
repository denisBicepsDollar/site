import {useMemo, useState} from 'react'
import {SelectionBar} from './components/SelectionBar.jsx'
import {TableBody} from './components/TableBody.jsx'
import {TableHeader} from './components/TableHeader.jsx'
import {TablePagination} from './components/TablePagination.jsx'
import {useProductSelection} from './model/useProductSelection.js'
import {useResponsiveItemsPerPage} from './model/useResponsiveItemsPerPage.js'
import {filterGoods} from './model/filterGoods.js'

export function RenderTable({
                                data,
                                headerTitles,
                                currentStatus,
                                searchQuery
                            }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useResponsiveItemsPerPage()

    const filteredGoods = useMemo(
        () => filterGoods(data, currentStatus, searchQuery),
        [data, currentStatus, searchQuery],
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredGoods.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredGoods.length / itemsPerPage)


    const {selectedIds, isAllSelected, toggle, clear} = useProductSelection(currentItems)

    // Фильтр/поиск/resize могут урезать список — не даём остаться на несуществующей странице.

    // КОРРЕКТИРОВКА СОСТОЯНИЯ ВО ВРЕМЯ РЕНДЕРИНГА
    // Если текущая страница больше максимальной (и страниц > 0), сбрасываем на последнюю доступную
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    } else if (currentPage < 1) {
        setCurrentPage(1);
    }

    const categories = useMemo(
        () => new Set(filteredGoods.map(item => item.status)),
        [filteredGoods],
    )

    return (
        <div>
            {/* Шапка таблицы + строки */}
            <div className={`
                flex
                flex-col
                mt-4
                border-2
                bg-stone-200
                border-stone-200
                rounded-lg
                overflow-hidden
                
            `}>
                <TableHeader
                    headerTitles={headerTitles}
                    isAllSelected={isAllSelected}
                    onToggleAll={() => toggle(!isAllSelected)}
                />

                {/* Рендер отдельных строк с товаром */}
                <div className="
                    flex
                    flex-col
                    justify-baseline
                    w-full
                    gap-0.5
                    ">
                    <TableBody
                        items={currentItems}
                        selectedIds={selectedIds}
                        onToggle={toggle}
                    />

                    {/* Переключалки далее назад страницы */}
                    <TablePagination
                        shownCount={Math.min(indexOfLastItem, filteredGoods.length)}
                        totalCount={filteredGoods.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={() => setCurrentPage(currentPage - 1)}
                        onNext={() => setCurrentPage(currentPage + 1)}
                    />
                </div>
            </div>

            {/* Плашка снизу */}
            <SelectionBar
                selectedCount={selectedIds.length}
                categories={categories}
                onClear={clear}
            />
        </div>
    )
}
