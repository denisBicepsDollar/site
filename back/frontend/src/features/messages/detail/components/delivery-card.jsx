import {MapPin, Truck} from "lucide-react";
import {InfoCard} from "@/features/orders/order/components/info-card.jsx";

export function DeliveryCard({delivery, className = ""}) {
    return (
        <InfoCard
            icon={Truck}
            title="Доставка"
            className={className}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Служба" value={delivery.company}/>
                <Detail label="Способ" value={delivery.method}/>
                <div className="sm:col-span-2">
                    <Detail
                        label="Адрес"
                        value={
                            <span className="inline-flex items-start gap-1.5">
                                <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#8E8E93]"/>
                                {delivery.address}
                            </span>
                        }
                    />
                </div>
            </div>
        </InfoCard>
    )
}

function Detail({label, value}) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#98989D]">
                {label}
            </p>
            <p className="mt-1 text-[13px] font-medium text-[#1C1C1E] dark:text-[#F2F2F7]">
                {value}
            </p>
        </div>
    )
}
