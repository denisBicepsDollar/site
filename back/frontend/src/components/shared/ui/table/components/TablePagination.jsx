import {Button} from "@/components/ui/button.jsx";

export function TablePagination({
                                    shownCount,
                                    totalCount,
                                    currentPage,
                                    totalPages,
                                    onPrev,
                                    onNext,
                                }) {
    return (
        <div
            className="bg-white px-4 py-2 flex gap-2 items-center"
        >
            <div className="flex-1">
                <span className="">
                    Показано {shownCount} из {totalCount} товаров
                </span>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <span>
                    Страница {currentPage} из {totalPages}
                </span>

                {currentPage != 1 && (
                    <Button
                        text='Назад'
                        onClick={onPrev}
                    />
                )}
                {currentPage != totalPages && (
                    <Button
                        text='Далее'
                        onClick={onNext}
                    />
                )}
            </div>
        </div>
    )
}
