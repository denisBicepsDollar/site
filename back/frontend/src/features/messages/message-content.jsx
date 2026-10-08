import {useMemo, useState} from "react"

import {PageHeader} from "@/features/dashboard/components/PageHeader.jsx"
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx"
import {StatusBadge} from "@/components/ui/status-badge.jsx"
import {Button} from "@/components/ui/button.jsx"
import {Card, CardContent} from "@/components/ui/card.jsx"
import {SectionPanel} from "@/components/ui/section-card.jsx"
import {SearchInput} from "@/components/ui/search-input.jsx"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx"
import {cn} from "cn"

const INITIAL_MESSAGES = [
    {
        id: "ТК-318",
        title: "Не пришло письмо с трек-номером",
        source: "Почта",
        orderNumber: "1044",
        from: "Анна Смирнова",
        initials: "АС",
        time: "17:15",
        status: "new",
        preview: "Здравствуйте! Не пришло письмо с трек-номером.",
        body: "Здравствуйте! Не пришло письмо с трек-номером. Подскажите, пожалуйста, отправили ли уже мой заказ?",
    },
    {
        id: "ТК-317",
        title: "Обмен размера худи",
        source: "Чат на сайте",
        orderNumber: null,
        from: "Илья Козлов",
        initials: "ИК",
        time: "16:42",
        status: "waiting",
        preview: "Можно обменять худи на размер больше?",
        body: "Здравствуйте! Можно обменять худи на размер больше? Бирки и упаковка сохранены.",
    },
]

const STATUS_LABELS = {
    new: "Новое",
    waiting: "Ждёт ответа",
    answered: "Отвечено",
}

export function MessagesListPage() {
    const [messages] = useState(INITIAL_MESSAGES)
    const [selectedId, setSelectedId] = useState(INITIAL_MESSAGES[0]?.id)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase()

        return messages.filter((message) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "new" && message.status === "new") ||
                (statusFilter === "waiting" && message.status === "waiting")

            const searchableText = [
                message.id,
                message.title,
                message.source,
                message.from,
                message.orderNumber ?? "",
                message.preview,
            ]
                .join(" ")
                .toLowerCase()

            return matchesStatus && (!query || searchableText.includes(query))
        })
    }, [messages, search, statusFilter])

    const selectedMessage =
        messages.find((message) => message.id === selectedId) ?? null

    const newCount = messages.filter(
        (message) => message.status === "new",
    ).length

    const waitingCount = messages.filter(
        (message) => message.status === "waiting",
    ).length

    return (
        <main className="min-h-screen bg-[#F2F2F7] px-4 pb-8 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader
                    title="Обращения"
                    description="Обратная связь, поддержка"
                    summary={`${newCount} новых — ответить · ${waitingCount} ждут ответа клиента`}
                />

                <section className="mt-5">
                    <SectionPanel
                        radius={20}
                        className="grid min-h-[560px] overflow-hidden border lg:grid-cols-[360px_minmax(0,1fr)]">
                        {/* Список обращений слева */}
                        <aside
                            className="flex min-h-0 min-w-0 flex-col border-b border-black/[0.06] dark:border-white/[0.08] lg:border-r lg:border-b-0">
                            <div
                                className="flex flex-col gap-3 border-b border-black/[0.06] p-4 dark:border-white/[0.08]">
                                <SearchInput
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Поиск обращений..."
                                    iconClassName="size-4"
                                    inputClassName="h-10 rounded-[14px] border-transparent bg-[#F2F2F7] shadow-none focus-visible:bg-white dark:bg-[#2C2C2E] dark:focus-visible:bg-[#3A3A3C]"
                                />
                                <Tabs
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <TabsList
                                        className="h-9 w-full justify-start gap-1 rounded-[12px] bg-[#F2F2F7] p-1 dark:bg-[#2C2C2E]">
                                        <TabsTrigger
                                            value="all"
                                            className="h-7 flex-1 rounded-[9px] px-2 text-xs data-active:bg-white data-active:text-[#1C1C1E] data-active:shadow-sm dark:data-active:bg-[#48484A] dark:data-active:text-white"
                                        >
                                            Все
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="new"
                                            className="h-7 flex-1 rounded-[9px] px-2 text-xs data-active:bg-white data-active:text-[#1C1C1E] data-active:shadow-sm dark:data-active:bg-[#48484A] dark:data-active:text-white"
                                        >
                                            Новые
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="waiting"
                                            className="h-7 flex-1 rounded-[9px] px-2 text-xs data-active:bg-white data-active:text-[#1C1C1E] data-active:shadow-sm dark:data-active:bg-[#48484A] dark:data-active:text-white"
                                        >
                                            Ждут ответа
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((message) => (
                                        <MessageListItem
                                            key={message.id}
                                            message={message}
                                            selected={message.id === selectedId}
                                            onClick={() =>
                                                setSelectedId(message.id)
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="px-4 py-10 text-center text-sm text-[#8E8E93] dark:text-[#98989D]">
                                        Обращения не найдены
                                    </p>
                                )}
                            </div>
                        </aside>

                        {/* Выбранное обращение справа */}
                        <section className="min-w-0">
                            {selectedMessage ? (
                                <MessageDetails message={selectedMessage}/>
                            ) : (
                                <div
                                    className="flex min-h-[320px] items-center justify-center p-6 text-sm text-[#8E8E93] dark:text-[#98989D]">
                                    Выберите обращение из списка
                                </div>
                            )}
                        </section>
                    </SectionPanel>
                </section>
            </div>
        </main>
    )
}

function MessageListItem({message, selected, onClick}) {
    const orderLabel = message.orderNumber
        ? `заказ №${message.orderNumber}`
        : "заказ №—"

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
                "h-auto w-full justify-start rounded-[14px] px-3 py-3 text-left",
                selected
                    ? "bg-[#007AFF]/[0.08] hover:bg-[#007AFF]/[0.1] dark:bg-[#0A84FF]/[0.12] dark:hover:bg-[#0A84FF]/[0.16]"
                    : "hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]",
            )}
        >
            <Avatar className="size-10 shrink-0">
                <AvatarFallback
                    className="bg-[#E5E5EA] text-xs font-semibold text-[#636366] dark:bg-[#3A3A3C] dark:text-[#D1D1D6]">
                    {message.initials}
                </AvatarFallback>
            </Avatar>

            <span className="ml-3 min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-[#1C1C1E] dark:text-white">
                        {message.from}
                    </span>
                    <span className="shrink-0 text-[10px] text-[#8E8E93] dark:text-[#98989D]">
                        {message.time}
                    </span>
                </span>

                <span className="mt-1 block truncate text-xs font-medium text-[#6E6E73] dark:text-[#AEAEB2]">
                    {message.title}
                </span>

                <span className="mt-1 block truncate text-xs text-[#8E8E93] dark:text-[#98989D]">
                    {message.preview}
                </span>

                <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <StatusBadge
                        tone={message.status === "new" ? "info" : "neutral"}>
                        {STATUS_LABELS[message.status]}
                    </StatusBadge>

                    <span className="text-[10px] text-[#8E8E93] dark:text-[#98989D]">
                        {message.id} · {message.source} · {orderLabel}
                    </span>
                </span>
            </span>
        </Button>
    )
}

function MessageDetails({message}) {
    const orderLabel = message.orderNumber
        ? `заказ №${message.orderNumber}`
        : "заказ №—"

    return (
        <Card className="min-h-[320px] rounded-none border-0 bg-transparent shadow-none">
            <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold tracking-tight text-[#1C1C1E] dark:text-white sm:text-xl">
                    {message.title}
                </h2>

                <p className="mt-2 text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                    {message.id} · {message.source} · {orderLabel}
                </p>

                <p className="mt-1 text-xs text-[#8E8E93] dark:text-[#98989D]">
                    От: {message.from}
                </p>

                <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-[#1C1C1E] dark:text-[#F2F2F7]">
                    {message.body}
                </div>
            </CardContent>
        </Card>
    )
}