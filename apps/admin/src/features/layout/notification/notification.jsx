import {useState, useRef, useEffect} from "react";
import {Bell, X, Check, ShoppingBag, AlertTriangle, Info, Trash2} from "lucide-react";

// Дефолтные системные уведомления для демонстрации
const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: "Новый заказ #1402",
        text: "Ожидает подтверждения и сборки",
        time: "5 мин назад",
        type: "order", // Зеленый маркер
        read: false,
    },
    {
        id: 2,
        title: "Товар заканчивается!",
        text: "«Зеленые усы Premium» осталось всего 3 шт.",
        time: "1 час назад",
        type: "warning", // Оранжевый маркер
        read: false,
    },
    {
        id: 3,
        title: "Синхронизация склада",
        text: "Успешно обновлено 148 позиций",
        time: "Вчера",
        type: "info", // Синий маркер
        read: true,
    },
];

export function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const [list, setList] = useState(INITIAL_NOTIFICATIONS);
    const containerRef = useRef(null);

    // Считаем только непрочитанные
    const unreadCount = list.filter((n) => !n.read).length;
    const displayCount = unreadCount > 9 ? "9+" : unreadCount;

    // Закрытие по клику снаружи (для десктопа)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Действие: Прочитать все
    const handleMarkAllAsRead = () => {
        setList((prev) => prev.map((n) => ({...n, read: true})));
    };

    // Действие: Удалить конкретное уведомление
    const handleDelete = (id, e) => {
        e.stopPropagation(); // чтобы не триггерить клик по строке
        setList((prev) => prev.filter((n) => n.id !== id));
    };

    // Действие: Клик по самому уведомлению (помечает как прочитанное)
    const handleItemClick = (id) => {
        setList((prev) =>
            prev.map((n) => (n.id === id ? {...n, read: true} : n))
        );
    };

    // Вспомогательный хелпер для iOS-иконок уведомлений
    const getNotificationStyle = (type) => {
        switch (type) {
            case "order":
                return {
                    icon: ShoppingBag,
                    bg: "bg-[#34C759]/10 text-[#34C759]",
                    dot: "bg-[#34C759]",
                };
            case "warning":
                return {
                    icon: AlertTriangle,
                    bg: "bg-[#FF9500]/10 text-[#FF9500]",
                    dot: "bg-[#FF9500]",
                };
            default:
                return {
                    icon: Info,
                    bg: "bg-[#007AFF]/10 text-[#007AFF]",
                    dot: "bg-[#007AFF]",
                };
        }
    };

    return (
        <div ref={containerRef} className="relative inline-flex">
            {/* Кнопка Колокольчика */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Уведомления"
                className={`
                    group relative
                    flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[14px]
                    transition-all duration-200 ease-out active:scale-90
                    backdrop-blur-md border
                    ${isOpen
                    ? "bg-white text-black border-black/10 dark:bg-[#1C1C1E] dark:text-white dark:border-white/10"
                    : "bg-white/70 text-[#8E8E93] border-black/[0.05] dark:bg-[#1C1C1E]/70 dark:border-white/[0.05] hover:text-black dark:hover:text-white"
                }
                `}
            >
                <Bell className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "" : "group-hover:rotate-12"}`}/>

                {unreadCount > 0 && (
                    <span className="
                        absolute -top-1 -right-1
                        flex h-5 min-w-5 items-center justify-center rounded-full
                        bg-[#FF3B30] px-1 text-[10px] font-bold text-white
                        tabular-nums select-none ring-2 ring-[#F2F2F7] dark:ring-black
                    ">
                        {displayCount}
                    </span>
                )}
            </button>

            {/*
              МЕНЮ УВЕДОМЛЕНИЙ:
              На мобилке: выдвижной нативный iOS Sheet снизу.
              На десктопе: красивый парящий поповер справа снизу.
            */}
            <div
                className={`
                    /* Общие стили */
                    fixed md:absolute z-50 flex flex-col overflow-hidden
                    bg-white/90 dark:bg-[#1C1C1E]/95 backdrop-blur-xl
                    border border-black/[0.08] dark:border-white/[0.08]
                    shadow-[0_10px_40px_rgba(0,0,0,0.15)]
                    transition-all duration-300 ease-in-out
                    
                    /* Поведение на мобилке (Выезжает снизу во весь экран шириной) */
                    inset-x-4 bottom-4 rounded-[24px] max-h-[80vh]
                    ${isOpen ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0 md:translate-y-2"}
                    
                    /* Поведение на десктопе (Парящий виджет справа) */
                    md:inset-auto md:right-0 md:top-14 md:bottom-auto md:w-[360px] md:rounded-[20px]
                    ${isOpen ? "md:scale-100 md:opacity-100" : "md:scale-95 md:opacity-0 md:pointer-events-none"}
                `}
            >
                {/* Шапка модалки */}
                <div
                    className="flex items-center justify-between p-4 pb-3 border-b border-black/[0.04] dark:border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[17px] text-black dark:text-white">Уведомления</span>
                        {unreadCount > 0 && (
                            <span
                                className="bg-[#FF3B30]/10 text-[#FF3B30] text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount} новых
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-medium text-[#007AFF] hover:underline cursor-pointer active:opacity-60"
                            >
                                Прочитать все
                            </button>
                        )}
                        {/* Кнопка закрытия для мобилы */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden flex h-7 w-7 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-[#8E8E93]"
                        >
                            <X className="h-4 w-4"/>
                        </button>
                    </div>
                </div>

                {/* Список уведомлений */}
                <div className="flex-1 overflow-y-auto no-scrollbar max-h-[320px] md:max-h-[380px]">
                    {list.length > 0 ? (
                        <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
                            {list.map((item) => {
                                const styles = getNotificationStyle(item.type);
                                const Icon = styles.icon;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleItemClick(item.id)}
                                        className={`
                                            group/item relative flex gap-3 p-4 text-left transition-colors duration-150 cursor-pointer
                                            ${item.read ? "bg-transparent opacity-75" : "bg-black/[0.01] dark:bg-white/[0.01]"}
                                            hover:bg-black/[0.03] dark:hover:bg-white/[0.03]
                                            active:bg-black/[0.05] dark:active:bg-white/[0.05]
                                        `}
                                    >
                                        {/* Нативный непрочитанный синий кружочек iOS */}
                                        {!item.read && (
                                            <span
                                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#007AFF]"/>
                                        )}

                                        {/* Круглая нативная иконка типа */}
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.bg}`}>
                                            <Icon className="h-5 w-5"/>
                                        </div>

                                        {/* Контент уведомления */}
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-baseline justify-between gap-1">
                                                <p className="truncate text-sm font-semibold text-black dark:text-white">
                                                    {item.title}
                                                </p>
                                                <span className="shrink-0 text-[11px] text-[#8E8E93]">
                                                    {item.time}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[#8E8E93] line-clamp-2 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>

                                        {/* Кнопка "Удалить" (Появляется при наведении или свайпе) */}
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="
                                                absolute right-3 top-1/2 -translate-y-1/2
                                                flex h-8 w-8 items-center justify-center rounded-full
                                                text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30] hover:text-white
                                                md:opacity-0 group-hover/item:opacity-100
                                                transition-all duration-200 active:scale-90
                                                cursor-pointer
                                            "
                                            title="Удалить"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Пустое состояние в стиле iOS */
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8E8E93]/10 text-[#8E8E93] mb-3">
                                <Check className="h-6 w-6"/>
                            </div>
                            <p className="text-sm font-semibold text-black dark:text-white">Новых уведомлений нет</p>
                            <p className="text-xs text-[#8E8E93] mt-1">Мы сообщим, когда что-то произойдет</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}