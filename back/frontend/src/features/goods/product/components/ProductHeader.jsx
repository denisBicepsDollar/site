import {ArrowLeft, Save} from "lucide-react"
import {Badge} from "@/components/ui/badge.jsx"
import {Button} from "@/components/ui/button.jsx"

export function ProductHeader({name, hasChanges, onBack, onSave}) {
    return (
        <header
            className="sticky top-0 z-30 flex w-full flex-col gap-3 border-b border-black/[0.06] bg-white/85 p-4 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#1C1C1E]/85 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    className="shrink-0 rounded-full text-[#007AFF] hover:bg-[#007AFF]/10 dark:text-[#0A84FF] dark:hover:bg-[#0A84FF]/10"
                >
                    <ArrowLeft aria-hidden="true" className="size-4"/>
                    <span>К товарам</span>
                </Button>

                <span aria-hidden="true" className="text-[#D1D1D6] dark:text-[#48484A]">
                    /
                </span>

                <h1 className="min-w-0 truncate text-base font-semibold tracking-tight text-[#1C1C1E] dark:text-white sm:text-lg">
                    {name}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Badge
                    variant={hasChanges ? "destructive" : "secondary"}
                    className={
                        hasChanges
                            ? "gap-1.5 rounded-full bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]"
                            : "gap-1.5 rounded-full bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158]"
                    }
                >
                    <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${
                            hasChanges
                                ? "bg-[#FF3B30] motion-safe:animate-pulse dark:bg-[#FF453A]"
                                : "bg-[#34C759] dark:bg-[#30D158]"
                        }`}
                    />
                    {hasChanges ? "Изменения не сохранены" : "Изменений нет"}
                </Badge>

                <Button
                    type="button"
                    onClick={onSave}
                    disabled={!hasChanges}
                    className="h-10 rounded-full bg-[#007AFF] px-4 text-white shadow-sm hover:bg-[#006FE6] active:scale-[0.98] dark:bg-[#0A84FF] dark:hover:bg-[#168FFF]"
                >
                    <Save aria-hidden="true" className="size-4"/>
                    Сохранить
                </Button>
            </div>
        </header>
    )
}