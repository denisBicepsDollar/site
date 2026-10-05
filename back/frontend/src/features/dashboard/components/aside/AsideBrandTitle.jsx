// Название магазина: показывается только в раскрытой панели
export default function AsideBrandTitle({isExpanded}) {
    return (
        <span
            className={`
                                text-white
                                whitespace-nowrap
                                ml-3
                                font-medium
                                text-lg
                                ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0 pointer-events-none"}
                                `}>
                                Зеленые усы
                        </span>
    );
}
