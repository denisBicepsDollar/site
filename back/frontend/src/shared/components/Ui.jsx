import {twMerge} from 'tailwind-merge';
import {Link, NavLink} from 'react-router-dom';
import {useEffect, useState} from "react";

const goods = [// --- КОМНАТНЫЕ РАСТЕНИЯ (Варианты: D5, D7, D10) ---
    {
        id: 1,
        name: "Монстера Делициоза",
        sku: "PL-001",
        category: "Комнатные растения",
        price: "2 400 ₽",
        stock: "15 шт",
        variants: "D10",
        status: "active",
        updated: "Сегодня",
        image: "/1.png"
    }, {
        id: 2,
        name: "Фикус Лирата",
        sku: "PL-002",
        category: "Комнатные растения",
        price: "4 800 ₽",
        stock: "1 шт",
        variants: "D10",
        status: "warning",
        updated: "Вчера",
        image: "/2.png"
    }, {
        id: 3,
        name: "Замиокулькас (Долларовое дерево)",
        sku: "PL-003",
        category: "Комнатные растения",
        price: "1 900 ₽",
        stock: "0 шт",
        variants: "D7",
        status: "inactive",
        updated: "2 дня назад",
        image: "/3.png"
    }, {
        id: 4,
        name: "Сансевиерия Лауренти",
        sku: "PL-004",
        category: "Комнатные растения",
        price: "1 600 ₽",
        stock: "40 шт",
        variants: "D7",
        status: "active",
        updated: "3 дня назад",
        image: "/4.png"
    }, {
        id: 5,
        name: "Хлорофитум Хохлатый",
        sku: "PL-005",
        category: "Комнатные растения",
        price: "650 ₽",
        stock: "25 шт",
        variants: "D5",
        status: "active",
        updated: "Сегодня",
        image: "/5.png"
    }, {
        id: 6,
        name: "Орхидея Фаленопсис (Белая)",
        sku: "PL-006",
        category: "Комнатные растения",
        price: "2 100 ₽",
        stock: "2 шт",
        variants: "D7",
        status: "warning",
        updated: "Вчера",
        image: "/6.png"
    }, {
        id: 7,
        name: "Спатифиллум (Женское счастье)",
        sku: "PL-007",
        category: "Комнатные растения",
        price: "1 350 ₽",
        stock: "0 шт",
        variants: "D7",
        status: "inactive",
        updated: "5 дней назад",
        image: "/7.png"
    }, {
        id: 8,
        name: "Эпипремнум Ауреум",
        sku: "PL-008",
        category: "Комнатные растения",
        price: "950 ₽",
        stock: "18 шт",
        variants: "D5",
        status: "active",
        updated: "Вчера",
        image: "/8.png"
    }, {
        id: 9,
        name: "Калатея Орната",
        sku: "PL-009",
        category: "Комнатные растения",
        price: "2 200 ₽",
        stock: "4 шт",
        variants: "D7",
        status: "active",
        updated: "Сегодня",
        image: "/9.png"
    }, {
        id: 10,
        name: "Антуриум Андре (Красный)",
        sku: "PL-010",
        category: "Комнатные растения",
        price: "1 750 ₽",
        stock: "3 шт",
        variants: "D7",
        status: "warning",
        updated: "2 дня назад",
        image: "/10.png"
    },

    // --- САДОВЫЕ РАСТЕНИЯ (Варианты: P9, C1, C2) ---
    {
        id: 11,
        name: "Гортензия крупнолистная",
        sku: "GD-001",
        category: "Садовые растения",
        price: "1 850 ₽",
        stock: "10 шт",
        variants: "C2",
        status: "active",
        updated: "Сегодня",
        image: "/11.png"
    }, {
        id: 12,
        name: "Лаванда узколистная",
        sku: "GD-002",
        category: "Садовые растения",
        price: "450 ₽",
        stock: "35 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/12.png"
    }, {
        id: 13,
        name: "Туя Западная Смарагд",
        sku: "GD-003",
        category: "Садовые растения",
        price: "2 900 ₽",
        stock: "12 шт",
        variants: "C1",
        status: "active",
        updated: "Вчера",
        image: "/13.png"
    }, {
        id: 14,
        name: "Спирея японская Литл Принцесс",
        sku: "GD-004",
        category: "Садовые растения",
        price: "550 ₽",
        stock: "20 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/14.png"
    }, {
        id: 15,
        name: "Роза чайно-гибридная Red",
        sku: "GD-005",
        category: "Садовые растения",
        price: "1 200 ₽",
        stock: "8 шт",
        variants: "C2",
        status: "active",
        updated: "Вчера",
        image: "/15.png"
    }, {
        id: 16,
        name: "Можжевельник Блю Эрроу",
        sku: "GD-006",
        category: "Садовые растения",
        price: "3 100 ₽",
        stock: "5 шт",
        variants: "C1",
        status: "active",
        updated: "3 дня назад",
        image: "/16.png"
    }, {
        id: 17,
        name: "Хоста Гибридная",
        sku: "GD-007",
        category: "Садовые растения",
        price: "480 ₽",
        stock: "15 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/17.png"
    }, {
        id: 18,
        name: "Барбарис Тунберга",
        sku: "GD-008",
        category: "Садовые растения",
        price: "950 ₽",
        stock: "6 шт",
        variants: "C2",
        status: "warning",
        updated: "Вчера",
        image: "/18.png"
    }, {
        id: 19,
        name: "Клематис Президент",
        sku: "GD-009",
        category: "Садовые растения",
        price: "850 ₽",
        stock: "0 шт",
        variants: "P9",
        status: "inactive",
        updated: "4 дня назад",
        image: "/19.png"
    }, {
        id: 20,
        name: "Флокс метельчатый",
        sku: "GD-010",
        category: "Садовые растения",
        price: "380 ₽",
        stock: "22 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/20.png"
    }];


export function AsideButton({
                                children, text, to, className = '',
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
        return (<NavLink
            to={to}
            className={({isActive}) => getStyles(isActive)}
        >
            {children}
            {text && <span className="font-medium">
                        {text}
                    </span>}
        </NavLink>);
    }
}

export function PageButton({
                               children, text, onClick, className, variant = 'default', disabled = false,
                           }) {

    const defaultStyle = `
    flex 
    items-center 
    justify-center
    gap-3 
    rounded-xl 
    p-2
    transition-all
    duration-200
    font-medium
    ease-out
    border-2
    border-border2
    
    /* Эффекты для активной кнопки (работают только если НЕ disabled) */
    ${!disabled ? 'cursor-pointer hover:brightness-110 hover:bg-muted/20 active:scale-98' : ''}
    
    /* Стили для отключенной кнопки */
    ${disabled ? 'opacity-50 cursor-not-allowed select-none active:scale-100' : ''}
    
    ${className}
    ${variant === 'accent' ? " bg-blue-500 text-white" : ""}
    `;

    return (
        <button
            className={defaultStyle}
            onClick={!disabled ? onClick : undefined} // Блокируем вызов клика на уровне JS
            disabled={disabled} // Передаем стандартный атрибут в тег button
        >
            {children}
            {text && <span>{text}</span>}
        </button>
    );
}


export function SortByStatusButtons({currentStatus, setCurrentStatus}) {

    const categories = new Map([['all', goods.length]]);

    for (const elem of goods) {
        const status = elem.status;
        const currentCount = categories.get(status) || 0
        categories.set(status, currentCount + 1)
    }

    return (<div className="flex flex-1">
        <div className="
            flex
            gap-2
            px-1
            bg-muted/20
            rounded-2xl
            items-center
            ">
            {Array.from(categories).map(([name, count]) => (<div
                    key={name}
                    onClick={() => setCurrentStatus(name)}
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
                        ${currentStatus === name ? "bg-white border-border2 border-2 shadow-sm" : "border-2 border-transparent text-muted/80 hover:bg-muted/5 "}
    
                        `}>
                    <button className={`
                            cursor-pointer
                            flex
                            transition-colors duration-200
                            ${currentStatus === name ? "" : "group-hover:text-black/80"}
                            `}>{name}
                    </button>
                    <span className={`
                                flex
                                px-1.5
                                text-sm
                                font-medium
                                transition-all duration-200
                                ease-out
                                ${currentStatus === name ? "bg-black  text-white " : " group-hover:brightness-110 text-muted/50 bg-muted/20  group-hover:text-black/60 group-hover:bg-muted/40 "}
                                rounded-xl
                                `}>
                                    {count}
                            </span>
                </div>

            ))}
        </div>
    </div>);

}

export function SearchByName({searchQuery, setSearchQuery}) {
    return (<label className="
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
            <path d="m21 21-4.34-4.34"/>
            <circle cx="11" cy="11" r="8"/>
        </svg>

        <input
            className="
                    outline-none
                    w-full
                    bg-transparent

                "
            type="text"
            placeholder="Название, артикул..."
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value)
            }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             className={`${searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                 transition-all duration-200 
                 w-7 p-1 h-7 
                 flex items-center 
                 justify-center 
                 rounded-full cursor-pointer 
                 hover:bg-muted/20 
                 hover:brightness-110 
                 active:scale-98`}
             onClick={() => setSearchQuery('')}
        >
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    </label>);

}

export function TableRender({currentStatus, searchQuery}) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;

            if (width < 640) {
                setItemsPerPage(4);
            } else if (width < 1600) {
                setItemsPerPage(5);
            } else {
                setItemsPerPage(8);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    const filteredGoods = goods
        .filter(elem => currentStatus === 'all' ? true : elem.status === currentStatus)
        .filter(elem => {
            const name = elem.name.toLowerCase().trim();
            const sku = elem.sku.toLowerCase().trim();
            const query = searchQuery.toLowerCase().trim();
            return name.includes(query) || sku.includes(query);
        })

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGoods.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredGoods.length / itemsPerPage);
    const categories = new Set(filteredGoods.map(elem => elem.status));

    let isAllSelected = currentItems.length > 0 && currentItems.every(elem => selectedIds.includes(elem.id))

    function handleToggle(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else if (typeof (id) === 'boolean') {
            if (id === false) {
                setSelectedIds([]);
            } else {
                let allIds = [...selectedIds]
                for (const elem of currentItems) {
                    if (!selectedIds.includes(elem.id)) {
                        allIds.push(elem.id);
                    }
                }
                setSelectedIds(allIds);

            }
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    return (

        <div>
            {/*
                    Шапка таблицы
                */}
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
                            checked={isAllSelected || selectedIds.includes(currentItems)}

                        />

                        <div className="border-2 border-gray-300 hover:scale-102 hover:border-gray-400 rounded-md bg-white
                          flex items-center justify-center transition-all duration-200
                          peer-checked:bg-blue-600/80 peer-checked:border-blue-600/80
                          cursor-pointer select-none group hover:brightness-110 active:scale-98
                          ease-out peer-checked:hover:scale-100 peer-checked:hover:border-blue-600/80

                          "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
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

                {/*
                        Рендер отдельных строк с товаром
                    */}

                <div className="
                    flex
                    flex-col
                    justify-baseline
                    w-full
                    gap-0.5
                    ">
                    {currentItems.map((item) => (<Link
                            key={item.id}
                            to={`${item.id}`}
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

                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24"
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
                        </Link>

                    ))}
                    {/*
                            Переключалки далее назад страницы
                        */}
                    <div
                        className="bg-white px-4 py-2 flex gap-2 items-center"
                    >
                        <div className="flex-1">
                            <span className="">
                            Показано {Math.min(indexOfLastItem, filteredGoods.length)} из {filteredGoods.length} товаров
                            </span>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <span>
                                Страница {currentPage} из {totalPages}
                            </span>

                            {currentPage != 1 && (<PageButton
                                text='Назад'
                                onClick={() => setCurrentPage(currentPage - 1)}
                            />)}
                            {currentPage != totalPages && (<PageButton
                                text='Далее'
                                onClick={() => setCurrentPage(currentPage + 1)}
                            />)}
                        </div>
                    </div>
                </div>
            </div>
            {/*
                    Плашка снизу
                */}
            <div
                className={`
                flex
                gap-3
                fixed
                left-1/2
                transition-all 
                duration-200
                -translate-x-1/2
                ease-out
                bottom-20
                h-min
                p-4
                py-2
                items-center
                rounded-2xl
                w-min
                bg-black
                text-white
                ${selectedIds.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
                `}
            >
                <span
                    className="flex font-medium whitespace-nowrap"
                >
                    Выбрано: {selectedIds.length}
                </span>
                <div className={`
                                     relative
                                     w-[1px] h-6 bg-muted/40 rounded-lg
                                `}>
                </div>
                {[...categories].map(elem => (<PageButton
                    key={elem}
                    text={elem}
                    className="
                        ">
                </PageButton>))}
                <PageButton variant='danger' text='Удалить'>
                </PageButton>

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className={`
                        transition-all 
                        duration-200
                        w-7 p-1 h-7 
                        flex items-center 
                        justify-center rounded-full 
                        cursor-pointer hover:bg-muted/20
                        hover:brightness-110 
                        active:scale-98
                        `}
                     onClick={() => setSelectedIds([])}

                >
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
            </div>
        </div>);

}
