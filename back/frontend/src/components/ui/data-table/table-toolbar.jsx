import {Input} from "@/components/ui/input.jsx"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx"
import {Search} from 'lucide-react';
import {Button} from "@/components/ui/button.jsx";

export function TableToolbar({table, uniqueStatuses}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
                defaultValue="all"
                onValueChange={(value) => {
                    table
                        .getColumn("status")
                        ?.setFilterValue(value === "all" ? undefined : value)
                }}
            >
                <TabsList
                    className="flex h-11 w-max max-w-full flex-nowrap gap-1 overflow-x-auto rounded-[14px] border border-black/[0.04] bg-[#F2F2F7] p-1 dark:border-white/[0.06] dark:bg-[#1C1C1E]">
                    <TabsTrigger
                        value="all"
                        className="h-9 shrink-0 rounded-[10px] px-3.5 text-sm font-medium text-[#6E6E73] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/35 data-[state=active]:bg-white data-[state=active]:text-[#1C1C1E] data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:text-[#98989D] dark:focus-visible:ring-[#0A84FF]/40 dark:data-[state=active]:bg-[#3A3A3C] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-none"
                    >
                        Все
                    </TabsTrigger>

                    {uniqueStatuses.map((status) => (
                        <TabsTrigger
                            key={status}
                            value={status}
                            className="h-9 shrink-0 rounded-[10px] px-3.5 text-sm font-medium text-[#6E6E73] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/35 data-[state=active]:bg-white data-[state=active]:text-[#1C1C1E] data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:text-[#98989D] dark:focus-visible:ring-[#0A84FF]/40 dark:data-[state=active]:bg-[#3A3A3C] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-none"
                        >
                            {status}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="relative w-full sm:max-w-sm">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#8E8E93]"/>

                <Input
                    placeholder="Поиск..."
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="relative w-full sm:max-w-sm">
                <Button
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="">
                    Экспорт
                </Button>
            </div>
        </div>
    )
}