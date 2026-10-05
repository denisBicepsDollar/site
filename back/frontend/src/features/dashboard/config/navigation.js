import {MessageCircle, Package, Settings, ShoppingCart} from "lucide-react";

export const dashboardNavigation = [
    {to: "/dashboard/goods", label: "Товары", icon: Package},
    {to: "/dashboard/orders", label: "Заказы", icon: ShoppingCart},
    {to: "/dashboard/messages", label: "Обращения", icon: MessageCircle},
    {to: "/dashboard/settings", label: "Настройки", icon: Settings},
];