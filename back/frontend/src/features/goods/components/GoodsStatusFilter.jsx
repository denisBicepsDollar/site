import {goodsList} from "../mocks/goodsList.js";
import {countByStatus} from "../model/goodsTable.js";

/* Фильтр списка товаров по статусу: «all 20 | active 14 | warning 3 | inactive 3».
   Счётчики считаются по тому же моку, что и таблица — источник один. */
export function GoodsStatusFilter({value, onChange}) {
    const counts = countByStatus(goodsList);

    return (
        <div className="flex flex-1">
            <div className="flex items-center gap-2 rounded-2xl bg-muted/20 px-1">
                {[...counts].map(([status, count]) => {
                    const isSelected = value === status;

                    return (
                        <div
                            key={status}
                            onClick={() => onChange(status)}
                            className={`group flex cursor-pointer items-baseline gap-0.5 rounded-xl
                                        px-1.5 py-0.5 transition-all duration-200 active:scale-98
                                        ${isSelected
                                ? "border-2 border-border2 bg-white shadow-sm"
                                : "border-2 border-transparent text-muted/80 hover:bg-muted/5"}`}>
                            <button className={`flex cursor-pointer transition-colors duration-200
                                                ${isSelected ? "" : "group-hover:text-black/80"}`}>
                                {status}
                            </button>
                            <span className={`flex rounded-xl px-1.5 text-sm font-medium transition-all
                                              duration-200 ease-out
                                              ${isSelected
                                ? "bg-black text-white"
                                : "bg-muted/20 text-muted/50 group-hover:bg-muted/40 group-hover:text-black/60 group-hover:brightness-110"}`}>
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
