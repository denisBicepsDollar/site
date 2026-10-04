import {useLocation} from "react-router-dom";

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

export function HeaderInfo() {
    const location = useLocation();
    const titles = {
        '/dashboard/goods' : {
            name : 'Товары',
            description : 'Каталог, варианты и остатки'
        },
        '/dashboard/orders' : {
            name: 'Заказы',
            description: 'Продажи, статусы и доставка'
        },
        '/dashboard/messages' : {
            name: 'Обращения',
            description: 'в'
        },
        '/dashboard/settings' : {
            name: 'Настройки',
            description: 'Магазин, доставка, оплата, уведомления'
        },
        '/dashboard' : {
            name : '',
            description : '',
        }
    }
    const currentTitle = titles[location.pathname]

    const activeStatus = goods.filter(elem => elem.status === "active");
    const lowStock = goods.filter(elem => parseInt(elem.stock) < 5);


    return (
        <>

            <div className={`
                        flex 
                        items-center
                        pt-8
                        pb-0
                        
                        `}>
                <div className={`
                                flex 
                                
                                w-full
                                gap-5
                                items-baseline
                                `}>
                    <h3 className={"font-medium text-2xl leading-none tracking-tighter"}>
                        {currentTitle.name}
                    </h3>
                    <div className={`
                                     relative
                                     top-1
                                     w-[2px] h-6 bg-muted rounded-lg
                                `}>
                    </div>
                    <p className={"text-muted text-xl font-light leading-none tracking-tighter"}>
                        {currentTitle.description}
                    </p>
                </div>
            </div>

            <div className={`
                        flex 
                        items-center
                        pt-3                        
                        `}>
                <div className={`
                        flex
                        items-center
                        text-muted
                        justify-baseline
                        font-normal text-md leading-5
                    `}>
                    {goods.length} позиций · {activeStatus.length} активных · {lowStock.length} заканчиваются
                </div>
            </div>

        </>

    );
}