import {CreditCard, UserRound} from "lucide-react"

import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx"
import {Badge} from "@/components/ui/badge.jsx"
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx"
import {Separator} from "@/components/ui/separator.jsx"
import {SectionCard} from "@/components/ui/section-card.jsx"

export function CustomerPaymentCard({customer, payment}) {
    const paymentStatus = payment.status.toLowerCase()

    const paymentBadgeClass = paymentStatus.includes("оплач")
        ? "bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158]"
        : paymentStatus.includes("отмен")
            ? "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]"
            : "bg-[#FF9F0A]/10 text-[#A65E00] dark:bg-[#FF9F0A]/15 dark:text-[#FFB340]"

    return (
        <SectionCard radius={20} className="min-w-0">
            <CardHeader className="p-4 pb-3 sm:px-5">
                <CardTitle className="text-sm font-semibold text-[#1C1C1E] dark:text-white">
                    Покупатель и оплата
                </CardTitle>
            </CardHeader>

            <CardContent
                className="grid gap-4 px-4 pb-4 sm:grid-cols-[minmax(0,1.2fr)_1px_minmax(0,1fr)] sm:items-center sm:px-5">
                {/* Покупатель */}
                <section className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-11 shrink-0">
                        <AvatarFallback
                            className="bg-[#007AFF]/10 text-sm font-semibold text-[#007AFF] dark:bg-[#0A84FF]/15 dark:text-[#64D2FF]">
                            {customer.initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div
                            className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[#8E8E93] dark:text-[#98989D]">
                            <UserRound aria-hidden="true" className="size-3.5"/>
                            Покупатель
                        </div>
                        <p className="truncate text-[13px] font-semibold text-[#1C1C1E] dark:text-white">
                            {customer.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#6E6E73] dark:text-[#AEAEB2]">
                            {customer.phone}
                        </p>
                        <p className="truncate text-xs text-[#8E8E93] dark:text-[#98989D]">
                            {customer.email}
                        </p>
                    </div>
                </section>

                {/* Разделитель: горизонтальный на мобильном, вертикальный на sm+ */}
                <Separator className="bg-[#E5E5EA] dark:bg-[#38383A] sm:hidden"/>
                <Separator
                    orientation="vertical"
                    className="hidden h-14 self-center bg-[#E5E5EA] dark:bg-[#38383A] sm:block"
                />

                {/* Оплата */}
                <section className="flex min-w-0 flex-col gap-2">
                    <div
                        className="flex items-center gap-1.5 text-[11px] font-medium text-[#8E8E93] dark:text-[#98989D]">
                        <CreditCard aria-hidden="true" className="size-3.5"/>
                        Оплата
                    </div>

                    <p className="text-[13px] font-medium text-[#1C1C1E] dark:text-[#F2F2F7]">
                        {payment.method}
                    </p>

                    <Badge
                        variant="secondary"
                        className={`w-fit rounded-full ${paymentBadgeClass}`}
                    >
                        {payment.status}
                    </Badge>
                </section>
            </CardContent>
        </SectionCard>
    )
}