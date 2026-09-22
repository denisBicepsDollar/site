import { twMerge } from 'tailwind-merge';
import { NavLink } from 'react-router-dom';

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
    const goods = [
        { id: 1, name: "Свитшот Over size", sku: "SW-2940", category: "Одежда", price: "4 200 ₽", stock: "12 шт", variants: "S, M, L", status: "active", updated: "Сегодня" },
        { id: 2, name: "Футболка хлопковая Basic", sku: "TS-1022", category: "Одежда", price: "1 800 ₽", stock: "1 шт", variants: "M, XL", status: "warning", updated: "Вчера" },
        { id: 3, name: "Кепка Сasual", sku: "CP-4411", category: "Аксессуары", price: "1 200 ₽", stock: "0 шт", variants: "One size", status: "inactive", updated: "2 дня назад" },
    ];
    return (


        <div className={`
            flex
            flex-col
            m-8
            border-2
            border-stone-200
            rounded-lg
        `}>
            <div className="
                flex
                items-center
                w-full
                border-b-2
                border-stone-200
                py-3
                px-4">
                <div className="w-[40px]">
                    <input
                        type="checkbox"
                        className=""
                    >
                    </input>
                </div>
                <div className="flex-1">Товар</div>
                <div className="w-2/12 text-center">Категория</div>
                <div className="w-1/12 text-center">Цена</div>
                <div className="w-1/12 text-center">Остаток</div>
                <div className="w-2/12 text-center">Варианты</div>
                <div className="w-1/12 text-center">Статус</div>
                <div className="w-1/12 text-right">Обновлен</div>
            </div>

            <div className="
                flex

                items-center
                w-full

                border-stone-200
                rounded-lg
                py-5
                px-4
                ">

                <div className="w-1/12">
                    <input
                        type="checkbox"
                        className=""
                    >
                    </input>
                </div>
                <div className="w-3/12">Товар</div>
                <div className="w-2/12 text-center">Категория</div>
                <div className="w-1/12 text-center">Цена</div>
                <div className="w-1/12 text-center">Остаток</div>
                <div className="w-2/12 text-center">Варианты</div>
                <div className="w-1/12 text-center">Статус</div>
                <div className="w-1/12 text-right">Обновлен</div>
            </div>
        </div>
    );

}