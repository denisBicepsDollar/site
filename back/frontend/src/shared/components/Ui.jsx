import { twMerge } from 'tailwind-merge';
import { NavLink } from 'react-router-dom';
import {useEffect, useState} from "react";

const goods = [
    { id: 1, name: "Монстера Делициоза", sku: "PL-001", category: "Комнатные растения", price: "2 400 ₽", stock: "15 шт", variants: "D-17, H-60", status: "active", updated: "Сегодня", image: "/1.png" },
    { id: 2, name: "Фикус Лирата", sku: "PL-002", category: "Комнатные растения", price: "4 800 ₽", stock: "1 шт", variants: "D-21, H-110", status: "warning", updated: "Вчера", image: "/2.png" },
    { id: 3, name: "Замиокулькас (Долларовое дерево)", sku: "PL-003", category: "Комнатные растения", price: "1 900 ₽", stock: "0 шт", variants: "D-14, H-45", status: "inactive", updated: "2 дня назад", image: "/3.png" },
    { id: 4, name: "Букет «Нежное утро» (Розы и эвкалипт)", sku: "FL-101", category: "Срезанные цветы", price: "3 500 ₽", stock: "8 шт", variants: "M (25 см)", status: "active", updated: "Сегодня", image: "/4.png" },
    { id: 5, name: "Сансевиерия Лауренти", sku: "PL-004", category: "Комнатные растения", price: "1 600 ₽", stock: "40 шт", variants: "D-12, H-35", status: "active", updated: "3 дня назад", image: "/5.png" },
    { id: 6, name: "Суккулент Микс в кашпо", sku: "PL-005", category: "Суккуленты", price: "650 ₽", stock: "25 шт", variants: "D-6, H-10", status: "active", updated: "Сегодня", image: "/6.png" },
    { id: 7, name: "Орхидея Фаленопсис (Белая)", sku: "PL-006", category: "Цветущие растения", price: "2 100 ₽", stock: "2 шт", variants: "1 ствол, H-60", status: "warning", updated: "Вчера", image: "/7.png" },
    { id: 8, name: "Спатифиллум (Женское счастье)", sku: "PL-007", category: "Цветущие растения", price: "1 350 ₽", stock: "0 шт", variants: "D-12, H-40", status: "inactive", updated: "5 дней назад", image: "/8.png" },
    { id: 9, name: "Букет «Французская лаванда»", sku: "FL-102", category: "Сухоцветы", price: "1 800 ₽", stock: "12 шт", variants: "One size", status: "active", updated: "Сегодня", image: "/9.png" },
    { id: 10, name: "Эпипремнум Ауреум (Ампельный)", sku: "PL-008", category: "Комнатные растения", price: "950 ₽", stock: "18 шт", variants: "D-12, H-20", status: "active", updated: "Вчера", image: "/10.png" },
    { id: 11, name: "Калатея Орната", sku: "PL-009", category: "Комнатные растения", price: "2 200 ₽", stock: "4 шт", variants: "D-14, H-50", status: "active", updated: "Сегодня", image: "/11.png" },
    { id: 12, name: "Антуриум Андре (Красный)", sku: "PL-010", category: "Цветущие растения", price: "1 750 ₽", stock: "3 шт", variants: "D-12, H-45", status: "warning", updated: "2 дня назад", image: "/12.png" },
    { id: 13, name: "Алоэ Вера Премиум", sku: "PL-011", category: "Суккуленты", price: "1 100 ₽", stock: "14 шт", variants: "D-10, H-30", status: "active", updated: "Сегодня", image: "/13.png" },
    { id: 14, name: "Букет из 15 красных роз (Кения)", sku: "FL-103", category: "Срезанные цветы", price: "2 850 ₽", stock: "0 шт", variants: "40 см", status: "inactive", updated: "4 дня назад", image: "/14.png" },
    { id: 15, name: "Папоротник Нефролепис", sku: "PL-012", category: "Комнатные растения", price: "1 450 ₽", stock: "7 шт", variants: "D-15, H-35", status: "active", updated: "Вчера", image: "/15.png" },
    { id: 16, name: "Хамедорея Изящная (Пальма)", sku: "PL-013", category: "Комнатные растения", price: "1 200 ₽", stock: "9 шт", variants: "D-12, H-40", status: "active", updated: "Сегодня", image: "/16.png" },
    { id: 17, name: "Эхеверия Миранда", sku: "PL-014", category: "Суккуленты", price: "550 ₽", stock: "30 шт", variants: "D-8, H-12", status: "active", updated: "3 дня назад", image: "/17.png" },
    { id: 18, name: "Традесканция Зебрина", sku: "PL-015", category: "Комнатные растения", price: "800 ₽", stock: "1 шт", variants: "D-10, H-15", status: "warning", updated: "Вчера", image: "/18.png" },
    { id: 19, name: "Грунт премиум для ароидных", sku: "SU-501", category: "Сопутствующие товары", price: "450 ₽", stock: "50 шт", variants: "3 литра", status: "active", updated: "Сегодня", image: "/19.png" },
    { id: 20, name: "Кашпо керамическое (Мрамор)", sku: "SU-502", category: "Сопутствующие товары", price: "1 250 ₽", stock: "0 шт", variants: "D-16, H-16", status: "inactive", updated: "6 дней назад", image: "/20.png" }
];


export function AsideButton({
                                children,
                                text,
                                to,
                                className = '',
                            }) {

    const getStyles = (isActive) => twMerge(`
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
        ${isActive ? 'bg-white text-black font-semibold' : 'hover:bg-blue-600/40 hover:text-white'}
        ${className}
    `);

    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) => getStyles(isActive)}
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
}

export function PageButton(
    {
        children,
        text,
        onClick,
        className = '',
        variant = 'default',
    }) {

    const defaultStyle = `
    flex 
    items-center 
    gap-3 
    rounded-xl 
    p-2
    cursor-pointer
    transition-all
    duration-150
    font-medium
    ease-out
    hover:brightness-110 
    active:scale-98
    border-2
    border-border2
    ${variant === 'accent' ? " bg-blue-500 text-white" : ""}
    `

    return (
        <button className={defaultStyle} onClick={onClick}>
            {children}
            <span>
                {text}
            </span>
        </button>

    )

}



export function SortByStatusButtons(){
    const [selected, setSelected] = useState('all');


    const categories = new Map([['all', goods.length]]);

    for (const elem of goods) {
        const status = elem.status;
        const currentCount = categories.get(status) || 0
        categories.set(status, currentCount+1)
    }

    return (
        <div className="flex flex-1">
            <div className="
            flex
            gap-2
            px-1
            bg-muted/20
            rounded-2xl
            items-center
            ">
                {
                    Array.from(categories).map(([name, count]) => (
                    <div
                        onClick={() => setSelected(name)}
                        className={`
                        flex
                        cursor-pointer
                        px-1.5
                        gap-0.5
                        py-0.5
                        rounded-xl
                        items-baseline
                        group
                        transition-all 
                        duration-200 
                        active:scale-98
                        bg-transparent
                        ${selected === name ? "bg-white border-border2 border-2 shadow-sm" : "border-2 border-transparent text-muted/80 hover:bg-muted/5 "}
    
                        `}>
                            <button className={`
                            cursor-pointer
                            flex
                            transition-colors duration-200
                            ${selected === name ? "" : "group-hover:text-black/80"}
                            `}>{name}
                            </button>
                            <span className={`
                                flex
                                px-1.5
                                text-sm
                                font-medium
                                transition-all duration-200
                                ease-out
                                ${selected === name ? "bg-black  text-white " : " group-hover:brightness-110 text-muted/50 bg-muted/20  group-hover:text-black/60 group-hover:bg-muted/40 "}
                                rounded-xl
                                `}>
                                    {count}
                            </span>
                    </div>

                    ))
                }
            </div>
        </div>
    );

}

export function SearchByName(){
    const [text, setText] = useState('');

    return (
        <label className="
            flex
            flex-row
            border-2
            items-center
            rounded-xl
            p-2
            w-55
            cursor-text
            transition-all duration-200
            border-border2
            focus-within:shadow-md focus-within:shadow-blue-600/20
        ">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className=" w-5 mr-2">
                <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
            </svg>

            <input
                className="
                    outline-none
                    w-full
                    bg-transparent

                "
                type="text"
                placeholder="Название, артикул..."
                value={text}
                onChange={(e) => {setText(e.target.value)}}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 className={`${text ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-all duration-200 w-7 p-1 h-7 flex items-center justify-center rounded-full cursor-pointer hover:bg-muted/20`}
                 onClick={() => setText('')}
            >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
            </svg>
        </label>
    );

}

export function TableRender() {
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        function handleResize(){
            const width = window.innerWidth;

            if (width < 640) {
                setItemsPerPage(4);
            }
            else if (width < 1600) {
                setItemsPerPage(5);
            }
            else {
                setItemsPerPage(8);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = goods.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(goods.length / itemsPerPage);


    let isAllSelected = currentItems.length > 0 && selectedIds.length === currentItems.length;

    function handleToggle(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        }
        else if (typeof(id) === 'boolean') {
            if (id === false) {
                setSelectedIds([]);
            }
            else {
                let allIds = [...selectedIds]
                for (const elem of currentItems) {
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
                    currentItems.map((item) => (
                        <div
                            key={item.id}
                            className={`
                            flex 
                            cursor-pointer
                            items-center w-full  px-4 py-3  text-sm text-stone-900 hover:bg-stone-50/60 
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
                <div
                    className="bg-white px-4 py-2 flex gap-2"
                >
                    <div className="flex-1">
                        <span>
                        Показано {Math.min(indexOfLastItem,goods.length)} из {goods.length} товаров
                        </span>
                    </div>
                    <div className="flex flex-row">
                        <span>
                            Страница {currentPage} из {totalPages}
                        </span>

                        {currentPage != 1  && (<PageButton
                            text='Назад'
                            onClick={() => setCurrentPage(currentPage - 1)}
                        />)}
                        {currentPage != totalPages  && (<PageButton
                            text='Далее'
                            onClick={() => setCurrentPage(currentPage + 1)}
                        />)}
                    </div>
                </div>
            </div>
        </div>
    );

}