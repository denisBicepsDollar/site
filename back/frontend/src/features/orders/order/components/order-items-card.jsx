import {Badge} from "@/components/ui/badge.jsx";
import {CardContent} from "@/components/ui/card.jsx";
import {Package} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {
    SectionCard,
    SectionCardHeader,
} from "@/components/ui/section-card.jsx";
import {SummaryRow} from "@/features/orders/order/components/summary-row.jsx";

const formatPrice = (value) =>
    new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(value)

export function OrderItemsCard({items, itemsTotal, deliveryPrice, orderTotal}) {
    const itemCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    )

    return (
        <SectionCard radius={20} className="min-w-0">
            <SectionCardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 p-4 pb-3 sm:px-5">
                <SectionCardHeader
                    title="Состав заказа"
                    className="flex flex-row items-center justify-between gap-3 space-y-0 sm:px-5"
                >
                    <Badge variant="secondary" className="rounded-full tabular-nums">
                        {itemCount} товара
                    </Badge>
                </SectionCardHeader>

                <CardContent className="px-4 pb-4 sm:px-5">
                    <div className="divide-y divide-[#E5E5EA] dark:divide-[#38383A]">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 py-3"
                            >
                                <div
                                    className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[#F2F2F7] text-[#8E8E93] dark:bg-[#2C2C2E] dark:text-[#AEAEB2]">
                                    <Package className="size-6"/>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold text-[#1C1C1E] dark:text-white">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-[#8E8E93] dark:text-[#98989D]">
                                        {item.options}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-[13px] font-semibold tabular-nums text-[#1C1C1E] dark:text-white">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                    <p className="mt-1 text-xs tabular-nums text-[#8E8E93] dark:text-[#98989D]">
                                        {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-3 bg-[#E5E5EA] dark:bg-[#38383A]"/>

                    <div className="w-full space-y-2">
                        <SummaryRow label="Товары" value={formatPrice(itemsTotal)}/>
                        <SummaryRow
                            label="Доставка"
                            value={formatPrice(deliveryPrice)}
                        />

                        <Separator className="my-2 bg-[#E5E5EA] dark:bg-[#38383A]"/>

                        <SummaryRow
                            label="Итого"
                            value={formatPrice(orderTotal)}
                            strong
                        />
                    </div>
                </CardContent>
            </SectionCardHeader>
        </SectionCard>
    )
}

