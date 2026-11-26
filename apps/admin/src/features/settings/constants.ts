import {Bell} from "lucide-react";

export const DEFAULT_SETTINGS = {
    notificationEmail: "admin@nordgoods.com",
    notifyNewOrders: true,
    notifyMessages: true,
    notifyLowStock: false,
    dailyDigest: true,
}
export const SETTINGS_NAV = [
    {
        id: "notifications",
        label: "Уведомления",
        description: "Какие события и куда отправлять.",
        icon: Bell,
    },
]