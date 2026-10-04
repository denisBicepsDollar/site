import {Link} from "react-router-dom";
import {Check, MoreHorizontal} from "lucide-react";

/* Строка таблицы товаров: чекбокс, фото с названием, колонки, кнопка «…» */
export function GoodsTableRow({item, isSelected, onToggle}) {
    return (
        <Link
            to={`${item.id}`}
            className={`flex w-full cursor-pointer items-center px-4 py-3 text-sm text-stone-900
                        transition-colors hover:bg-stone-50/60
                        ${isSelected ? "bg-stone-50/60" : "bg-white"}`}>
            <label>
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isSelected}
                    onChange={onToggle}
                />

                <div className="flex cursor-pointer select-none items-center justify-center rounded-md border-2
                                border-gray-300 bg-white transition-all duration-200 ease-out
                                hover:scale-102 hover:border-gray-400 active:scale-98
                                peer-checked:border-blue-600/80 peer-checked:bg-blue-600/80
                                peer-checked:hover:scale-100 peer-checked:hover:border-blue-600/80">
                    <Check className="h-4 w-4 text-white" aria-hidden="true"/>
                </div>
            </label>

            <div className="flex flex-1 flex-row items-center gap-3 pl-5">
                <img className="h-12 w-12 rounded-lg object-cover" src={item.image} alt=""/>
                <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs font-medium text-muted">{item.sku}</p>
                </div>
            </div>

            <div className="w-2/12 text-center text-muted">{item.category}</div>
            <div className="w-1/12 text-center font-medium">{item.price}</div>
            <div className="w-1/12 text-center">{item.stock}</div>
            <div className="w-2/12 text-center text-muted">{item.variants}</div>
            <div className="w-1/12 text-center">{item.status}</div>
            <div className="w-1/12 text-center text-muted">{item.updated}</div>

            <button
                type="button"
                aria-label="Действия с товаром"
                className="flex w-1/12 shrink-0 justify-end">
                <MoreHorizontal
                    aria-hidden="true"
                    className="h-7 w-7 cursor-pointer rounded-xl border-2 border-border2 bg-white p-1
                               text-muted transition-all duration-150 ease-out hover:scale-102
                               hover:bg-blue-600/80 hover:text-white hover:brightness-110 active:scale-98"/>
            </button>
        </Link>
    );
}
