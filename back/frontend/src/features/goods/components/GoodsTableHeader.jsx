import {Minus} from "lucide-react";

/* Шапка таблицы: чекбокс «выбрать всё» + названия колонок */
export function GoodsTableHeader({isAllSelected, onToggleAll}) {
    return (
        <div className="flex w-full border-b-2 border-stone-200 bg-white px-4 py-3 text-xs font-medium
                        uppercase tracking-wider text-muted">
            <label>
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isAllSelected}
                    onChange={() => onToggleAll(!isAllSelected)}
                />

                <div className="flex cursor-pointer select-none items-center justify-center rounded-md border-2
                                border-gray-300 bg-white transition-all duration-200 ease-out
                                hover:scale-102 hover:border-gray-400 hover:brightness-110 active:scale-98
                                peer-checked:border-blue-600/80 peer-checked:bg-blue-600/80
                                peer-checked:hover:scale-100 peer-checked:hover:border-blue-600/80">
                    <Minus className="h-4 w-4 text-white" aria-hidden="true"/>
                </div>
            </label>

            <div className="flex-1 pl-5">Товар</div>
            <div className="w-2/12 text-center">Категория</div>
            <div className="w-1/12 text-center">Цена</div>
            <div className="w-1/12 text-center">Остаток</div>
            <div className="w-2/12 text-center">Варианты</div>
            <div className="w-1/12 text-center">Статус</div>
            <div className="w-1/12 text-center">Обновлен</div>
            <div className="w-1/12 shrink-0 text-right"/>
        </div>
    );
}
