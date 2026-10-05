import AsideNavItem from "./AsideNavItem.jsx";
import {GoodsIcon, MessagesIcon, OrdersIcon, SettingsIcon} from "./icons.jsx";

const NAV_ITEMS = [
    {to: "goods", text: "Товары", icon: <GoodsIcon/>, iconClassName: "cursor-pointer p-2"},
    {to: "orders", text: "Заказы", icon: <OrdersIcon/>, iconClassName: "p-2"},
    {to: "messages", text: "Обращения", icon: <MessagesIcon/>, iconClassName: "p-2"},
    {to: "settings", text: "Настройки", icon: <SettingsIcon/>, iconClassName: "p-2"},
];

// Основная навигация панели
export default function AsideNav() {
    return (
        <nav className="
                    flex
                    flex-1
                    flex-col
                    gap-3
                ">
            {NAV_ITEMS.map(item => (
                <AsideNavItem key={item.to} {...item}/>
            ))}
        </nav>
    );
}
