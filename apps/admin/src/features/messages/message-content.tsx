import {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {PageHeader} from "@/features/dashboard/components/PageHeader.tsx";
import {Avatar, AvatarFallback} from "@site/ui/avatar";
import {Button} from "@site/ui/button";
import {Card, CardContent} from "@site/ui/card";
import {SectionPanel} from "@/shared/ui/sections/section-card.tsx";
import {SearchInput} from "@site/ui/search-input";
import {messagesApi, type AdminMessage} from "@/shared/api/messages/messagesApi.ts";
import {cn} from "cn";

function getInitials(name: string | null): string {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "КЛ";
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function MessagesListPage() {
    const {id: routeId} = useParams();
    const parsedRouteId = routeId && /^\d+$/.test(routeId) ? Number(routeId) : null;
    const {data: messages = [], isLoading, isError, error, refetch} = useQuery({
        queryKey: ["admin", "messages"],
        queryFn: messagesApi.list,
        staleTime: 30_000,
    });
    const [selectedId, setSelectedId] = useState<number | null>(parsedRouteId);
    const [search, setSearch] = useState("");

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return messages;
        return messages.filter((msg) =>
            [String(msg.id), msg.name ?? "", msg.email ?? "", msg.phone ?? "", msg.message]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [messages, search]);

    const effectiveSelectedId = selectedId ?? filteredMessages[0]?.id ?? null;
    const selectedMessage =
        messages.find((message) => message.id === effectiveSelectedId) ?? null;

    return (
        <main className="min-h-screen bg-[#F2F2F7] px-4 pb-8 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
                <PageHeader
                    title="Обращения"
                    description={`Обратная связь из базы данных (${messages.length})`}
                />

                {isLoading && <p className="mt-5 text-sm text-[#8E8E93]">Загружаем обращения…</p>}
                {isError && (
                    <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-[#FF3B30]/10 p-4 text-sm text-[#D70015]">
                        <span>Не удалось загрузить обращения: {error.message}</span>
                        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                            Повторить
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && (
                    <section className="mt-5">
                        <SectionPanel
                            radius={20}
                            className="grid min-h-[560px] overflow-hidden border lg:grid-cols-[360px_minmax(0,1fr)]"
                        >
                            <aside className="flex min-h-0 min-w-0 flex-col border-b border-black/[0.06] dark:border-white/[0.08] lg:border-r lg:border-b-0">
                                <div className="border-b border-black/[0.06] p-4 dark:border-white/[0.08]">
                                    <SearchInput
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Поиск обращений..."
                                        iconClassName="size-4"
                                        inputClassName="h-10 rounded-[14px] border-transparent bg-[#F2F2F7] shadow-none focus-visible:bg-white dark:bg-[#2C2C2E] dark:focus-visible:bg-[#3A3A3C]"
                                    />
                                </div>

                                <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                                    {filteredMessages.length > 0 ? (
                                        filteredMessages.map((message) => (
                                            <MessageListItem
                                                key={message.id}
                                                message={message}
                                                selected={message.id === effectiveSelectedId}
                                                onClick={() => setSelectedId(message.id)}
                                            />
                                        ))
                                    ) : (
                                        <p className="px-4 py-10 text-center text-sm text-[#8E8E93] dark:text-[#98989D]">
                                            Обращения не найдены
                                        </p>
                                    )}
                                </div>
                            </aside>

                            <section className="min-w-0">
                                {selectedMessage ? (
                                    <MessageDetails message={selectedMessage}/>
                                ) : (
                                    <div className="flex min-h-[320px] items-center justify-center p-6 text-sm text-[#8E8E93] dark:text-[#98989D]">
                                        Выберите обращение из списка
                                    </div>
                                )}
                            </section>
                        </SectionPanel>
                    </section>
                )}
            </div>
        </main>
    );
}

function MessageListItem({
    message,
    selected,
    onClick,
}: {
    message: AdminMessage;
    selected: boolean;
    onClick: () => void;
}) {
    const sender = message.name?.trim() || message.email || message.phone || "Покупатель";
    const timeLabel = message.createdAt
        ? new Date(message.createdAt).toLocaleString("ru-RU")
        : "";

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
                <AvatarFallback className="bg-[#E5E5EA] text-xs font-semibold text-[#636366] dark:bg-[#3A3A3C] dark:text-[#D1D1D6]">
                    {getInitials(message.name)}
                </AvatarFallback>
            </Avatar>

            <span className="ml-3 min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-[#1C1C1E] dark:text-white">
                        {sender}
                    </span>
                    <span className="shrink-0 text-[10px] text-[#8E8E93] dark:text-[#98989D]">
                        {timeLabel}
                    </span>
                </span>
                <span className="mt-1 block truncate text-xs text-[#8E8E93] dark:text-[#98989D]">
                    {message.message}
                </span>
            </span>
        </Button>
    );
}

function MessageDetails({message}: {message: AdminMessage}) {
    const sender = message.name?.trim() || "Покупатель";
    const timeLabel = message.createdAt
        ? new Date(message.createdAt).toLocaleString("ru-RU")
        : "—";

    return (
        <Card className="min-h-[320px] rounded-none border-0 bg-transparent shadow-none">
            <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white sm:text-xl">
                    Обращение #{message.id}
                </h2>
                <p className="mt-2 text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                    От: {sender} · {timeLabel}
                </p>
                {(message.email || message.phone) && (
                    <p className="mt-1 text-xs text-[#8E8E93] dark:text-[#98989D]">
                        {[message.email, message.phone].filter(Boolean).join(" · ")}
                    </p>
                )}
                <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-[#1C1C1E] dark:text-[#F2F2F7]">
                    {message.message}
                </div>
            </CardContent>
        </Card>
    );
}
