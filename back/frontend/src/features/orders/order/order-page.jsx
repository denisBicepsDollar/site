import {useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {Printer, CalendarDays} from 'lucide-react'
import {Badge} from '@/components/ui/badge.jsx'
import {ConfirmDialog} from "@/components/ui/confirm-dialog.jsx"

import {NotesSection} from "@/components/ui/notes-section.jsx"

import {CustomerPaymentCard} from "@/features/orders/order/components/customer-card.jsx";
import {DeliveryCard} from "@/features/orders/order/components/delivery-card.jsx";
import {OrderItemsCard} from "@/features/orders/order/components/order-items-card.jsx";
import {OrderTimeline} from "@/features/orders/order/components/order-timeline.jsx";
import {EntityHeader} from "@/components/ui/entity-page-header.jsx";

const ORDER_STEPS = [
    {title: "Создан", description: "Заказ оформлен"},
    {title: "Подтверждён", description: "Заказ подтверждён"},
    {title: "Собирается", description: "Заказ готовят к отправке"},
    {title: "Отправлен", description: "Заказ передан в доставку"},
    {title: "Завершён", description: "Заказ получен клиентом"},
]

const DEMO_TIMES = [
    "8 окт., 10:42",
    "8 окт., 10:55",
    "8 окт., 11:20",
    null,
    null,
]

function createDemoOrder(id) {
    return {
        number: id || "10482",
        createdAt: "8 окт. 2026, 10:42",
        customer: {
            initials: "АС",
            name: "Анна Смирнова",
            phone: "+7 999 123-45-67",
            email: "anna@example.com",
        },
        payment: {
            status: "Оплачен",
            method: "Картой онлайн",
        },
        delivery: {
            company: "СДЭК",
            method: "Курьер до двери",
            address: "Москва, ул. Лесная, 7",
        },
        deliveryPrice: 350,
        items: [
            {
                id: "plant-1",
                name: "Фикус Лирата",
                options: "Высота 80 см · Горшок M",
                quantity: 1,
                price: 4290,
            },
            {
                id: "plant-2",
                name: "Монстера Адансони",
                options: "Высота 35 см · Без кашпо",
                quantity: 2,
                price: 1890,
            },
        ],
    }
}

export function OrderPage() {
    const {id} = useParams()
    return <OrderForm key={id} id={id}/>
}

function OrderForm({id}) {
    const order = useMemo(() => createDemoOrder(id), [id])

    const [currentStep, setCurrentStep] = useState(2)
    const [note, setNote] = useState("")
    const [cancelled, setCancelled] = useState(false)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

    const itemsTotal = order.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
    )
    const orderTotal = itemsTotal + order.deliveryPrice

    const status = cancelled
        ? "Отменён"
        : ORDER_STEPS[currentStep].title

    const handleNextStep = () => {
        setCurrentStep((step) =>
            Math.min(step + 1, ORDER_STEPS.length - 1),
        )
    }

    return (
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
            <EntityHeader
                backLabel="Назад"
                title={`Заказ 21`}
                metadata={
                    <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-3.5"/>
                        {21}
        </span>
                }
                status={
                    <Badge
                        className="rounded-full bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#64D2FF]">
                        {status}
                    </Badge>
                }
                actions={[
                    {
                        id: "print",
                        label: "Накладная",
                        icon: Printer,
                        className:
                            "border-black/[0.08] bg-white text-[#007AFF] hover:bg-[#F2F2F7] dark:border-white/[0.1] dark:bg-[#2C2C2E] dark:text-[#0A84FF] dark:hover:bg-[#3A3A3C]",
                    },
                    {
                        id: "cancel",
                        label: "Отменить",
                        className:
                            "border-[#FF3B30]/20 bg-white text-[#D70015] hover:bg-[#FF3B30]/10 dark:border-[#FF453A]/25 dark:bg-[#1C1C1E] dark:text-[#FF6961] dark:hover:bg-[#FF453A]/15",
                        confirm: {
                            title: "Отменить заказ?",
                            description: `Заказ 21 будет отменён. Это действие нельзя будет отменить.`,
                            actionLabel: "Отменить заказ",
                            destructive: true,
                        },
                    },
                    {
                        id: "next",
                        label: "Следующий этап",
                        variant: "default",
                        className:
                            "bg-[#007AFF] px-4 text-white shadow-sm hover:bg-[#006FE6] dark:bg-[#0A84FF] dark:hover:bg-[#168FFF]",
                        confirm: {
                            title: "Перевести заказ дальше?",
                            description: `Заказ перейдёт на этап «${21}».`,
                            actionLabel: "Продолжить",
                        },
                    },
                ]}
            />

            <main
                className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-start gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5">
                <OrderTimeline
                    className="lg:col-span-2"
                    steps={ORDER_STEPS}
                    currentStep={currentStep}
                    timestamps={DEMO_TIMES}
                    cancelled={cancelled}
                />

                <div className="min-w-0 space-y-4">
                    <OrderItemsCard
                        items={order.items}
                        itemsTotal={itemsTotal}
                        deliveryPrice={order.deliveryPrice}
                        orderTotal={orderTotal}
                    />

                    <div className="grid min-w-0 gap-4 md:grid-cols-2">

                        <DeliveryCard
                            delivery={order.delivery}
                            className="md:col-span-2"
                        />
                    </div>
                </div>

                <aside className="min-w-0 space-y-4">
                    <CustomerPaymentCard
                        customer={order.customer}
                        payment={order.payment}
                    />
                    <NotesSection
                        note={note}
                        onNoteChange={setNote}
                    />
                </aside>
            </main>

            <ConfirmDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                title="Отменить заказ?"
                description={`Заказ №${order.number} будет отмечен как отменённый.`}
                cancelLabel="Не отменять"
                confirmLabel="Отменить заказ"
                destructive
                onConfirm={() => setCancelled(true)}
            />
        </div>
    )
}