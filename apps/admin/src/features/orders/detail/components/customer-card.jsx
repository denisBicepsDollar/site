import {CreditCard, UserRound} from "lucide-react"

import {Avatar, AvatarFallback} from "@/shared/ui/display/avatar.jsx"
import {CardContent} from "@/shared/ui/display/card.jsx"
import {Separator} from "@/shared/ui/display/separator.jsx"
import {
    SectionCard,
    SectionCardHeader,
} from "@/shared/ui/sections/section-card.jsx"
import {StatusBadge} from "@/shared/ui/display/status-badge.jsx"

export function CustomerPaymentCard({customer, payment}) {
    const paymentStatus = payment.status.toLowerCase()

    const paymentTone = paymentStatus.includes("оплач")
        ? "success"
        : paymentStatus.includes("отмен")
            ? "danger"
            : "warning"

    return (
        <SectionCard radius={20} className="min-w-0">
            <SectionCardHeader title="Покупатель и оплата" className="sm:px-5"/>

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

                    <StatusBadge tone={paymentTone} className="w-fit">
                        {payment.status}
                    </StatusBadge>
                </section>
            </CardContent>
        </SectionCard>
    )
}