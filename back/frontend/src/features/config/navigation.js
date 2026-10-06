import {MessagesSquare, Package, Settings2, SquareText} from "lucide-react";

export const dashboardNavigation = [
    {to: "/dashboard/goods", label: "Товары", icon: Package},
    {to: "/dashboard/orders", label: "Заказы", icon: SquareText},
    {to: "/dashboard/messages", label: "Обращения", icon: MessagesSquare},
    {to: "/dashboard/settings", label: "Настройки", icon: Settings2},
];