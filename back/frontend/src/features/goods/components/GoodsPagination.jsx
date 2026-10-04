import {PageButton} from "../../../shared/components/PageButton.jsx";

/* Подвал таблицы: сколько показано и переключалки страниц */
export function GoodsPagination({
                                    page,
                                    totalPages,
                                    shownCount,
                                    totalCount,
                                    onPrev,
                                    onNext,
                                }) {
    return (
        <div className="flex items-center gap-2 bg-white px-4 py-2">
            <div className="flex-1">
                <span>Показано {shownCount} из {totalCount} товаров</span>
            </div>

            <div className="flex flex-row items-center gap-3">
                <span>Страница {page} из {totalPages}</span>

                {page !== 1 && <PageButton text='Назад' onClick={onPrev}/>}
                {page !== totalPages && <PageButton text='Далее' onClick={onNext}/>}
            </div>
        </div>
    );
}
