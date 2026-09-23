import { twMerge } from 'tailwind-merge';
import { NavLink } from 'react-router-dom';
import {useState} from "react";

export function AsideButton({
                                children,
                                text,
                                to,
                                variant = 'default',
                                onClick,
                                className = '',
                                isActive: isDefaultActive = false // переименовали дефолтный пропс, чтобы не путаться
                            }) {

    const getStyles = (active) => twMerge(`
        flex 
        items-center 
        gap-3 
        text-muted 
        rounded-xl 
        p-1 
        transition-all
        duration-150
        ease-out
        hover:scale-102 hover:brightness-110 
        active:scale-98
        ${active ? 'bg-white text-black font-semibold' : 'hover:bg-blue-600/40 hover:text-white'}
        ${className}
    `);

    function handleClick(e) {
        if (onClick) {
            onClick(e);
        }
    }

    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) => getStyles(isActive)}
                onClick={handleClick}
            >
                {children}
                {
                    text &&
                    <span className="font-medium">
                        {text}
                    </span>
                }
            </NavLink>
        );
    }

    return (
        <button
            className={getStyles(isDefaultActive)}
            onClick={handleClick}
            data-selected={isDefaultActive}
        >
            {children}
            <span className="font-medium p-2 ">
                {text}
            </span>
        </button>
    );
}
export function SortByStatusButtons(){
    return (
        <div>
            sort
        </div>
    );

}

export function SearchByName(){
    return (
        <div>
            searchByName
        </div>
    );

}
export function TableRender(){
    const [selectedIds, setSelectedIds] = useState([]);






    const goods = [
        { id: 1, name: "Свитшот Over size", sku: "SW-2940", category: "Одежда", price: "4 200 ₽", stock: "12 шт", variants: "S, M, L", status: "active", updated: "Сегодня", image: "/1.png" },
        { id: 2, name: "Футболка хлопковая Basic", sku: "TS-1022", category: "Одежда", price: "1 800 ₽", stock: "1 шт", variants: "M, XL", status: "warning", updated: "Вчера", image: "/3.png" },
        { id: 3, name: "Кепка Сasual", sku: "CP-4411", category: "Аксессуары", price: "1 200 ₽", stock: "0 шт", variants: "One size", status: "inactive", updated: "2 дня назад", image: "/2.png" },
    ];
    let isAllSelected = goods.length > 0 && selectedIds.length === goods.length;

    function handleToggle(id){
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        }
        else if (typeof(id) === 'boolean') {
            if (id === false) {
                setSelectedIds([]);
            }
            else {
                let allIds = [...selectedIds]
                for (const elem of goods) {
                    if (!selectedIds.includes(elem.id)) {
                        allIds.push(elem.id);
                    }
                }
                setSelectedIds(allIds);

            }
        }
        else {
            setSelectedIds([...selectedIds, id]);
        }
    }
    return (


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
            <div className="
                flex
                w-full
                border-b-2
                bg-white
                border-stone-200
                py-3
                tracking-wider
                uppercase
                text-muted
                text-xs
                font-medium


                px-4">
                <label className="">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        onChange={() => handleToggle(!isAllSelected)}
                        checked={isAllSelected || selectedIds.length !== 0}

                    />

                    <div className="border-2 border-gray-300 hover:scale-102 hover:border-gray-400 rounded-md bg-white
                      flex items-center justify-center transition-all duration-200
                      peer-checked:bg-blue-600/80 peer-checked:border-blue-600/80
                      cursor-pointer select-none group hover:brightness-110 active:scale-98
                      ease-out peer-checked:hover:scale-100 peer-checked:hover:border-blue-600/80

                      "
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className=" w-4 h-4 text-white">
                        <path d="M5 12h14"/>
                    </svg>

                    </div>
                </label>

                <div className="flex-1 pl-5">Товар</div>
                <div className="w-2/12 text-center">Категория</div>
                <div className="w-1/12 text-center">Цена</div>
                <div className="w-1/12 text-center">Остаток</div>
                <div className="w-2/12 text-center">Варианты</div>
                <div className="w-1/12 text-center">Статус</div>
                <div className="w-1/12 text-center">Обновлен</div>
                <div className="w-1/12 shrink-0 text-right">

                </div>
            </div>

            <div className="
                flex
                flex-col
                justify-baseline
                w-full
                gap-0.5
                ">
                {
                    goods.map((item) => (
                        <div
                            key={item.id}
                            className={`
                            flex 
                            items-center w-full  px-4 py-4  text-sm text-stone-900 hover:bg-stone-50/60 
                            transition-colors
                            ${selectedIds.includes(item.id) ? "bg-stone-50/60" : "bg-white"}`}



                        >
                            <label className="">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => handleToggle(item.id)}
                                />

                                <div className="border-2 border-gray-300 hover:scale-102 hover:border-gray-400 rounded-md bg-white
                                      flex items-center justify-center transition-all duration-200
                                      peer-checked:bg-blue-600/80 peer-checked:border-blue-600/80
                                      cursor-pointer select-none group
                                      ease-out peer-checked:hover:scale-100 peer-checked:hover:border-blue-600/80
                                      "
                                >

                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" className="w-4 h-4 text-white">
                                        <path d="M20 6 9 17l-5-5"/>
                                    </svg>
                                </div>
                            </label>
                            <div className="flex flex-1 pl-5 flex-row gap-3 items-center">
                                <img
                                    className={`
                                    w-12
                                    h-12
                                    object-cover 
                                    rounded-lg
                                    `}
                                    src={item.image}>
                                </img>
                                <div>
                                    <p className={"font-medium"}>
                                        {item.name}
                                    </p>
                                    <p className="text-muted text-xs font-medium">
                                        {item.sku}
                                    </p>
                                </div>
                            </div>
                            <div className="w-2/12 text-center text-muted">{item.category}</div>
                            <div className="w-1/12 text-center font-medium">{item.price}</div>
                            <div className="w-1/12 text-center">{item.stock}</div>
                            <div className="w-2/12 text-center text-muted">{item.variants}</div>
                            <div className="w-1/12 text-center">{item.status}</div>
                            <div className="w-1/12 text-center text-muted">{item.updated}</div>
                            <button className="w-1/12 flex shrink-0  justify-end ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round" className="text-muted
                                     cursor-pointer

                                     w-7
                                     h-7
                                     transition-all
                                     duration-150
                                     ease-out
                                     bg-white
                                     hover:scale-102 hover:brightness-110
                                     active:scale-98
                                     rendering-geometric
                                     hover:bg-blue-600/80
                                     hover:text-white
                                     rounded-xl
                                     border-2 border-border2
                                     p-1">
                                    <circle cx="12" cy="12" r="1"/>
                                    <circle cx="19" cy="12" r="1"/>
                                    <circle cx="5" cy="12" r="1"/>
                                </svg>
                            </button>
                        </div>

                    ))
                }

            </div>
        </div>
    );

}