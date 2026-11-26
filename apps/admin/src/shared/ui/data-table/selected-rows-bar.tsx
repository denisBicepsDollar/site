import {Button} from "@site/ui/button";
import {Separator} from "@site/ui/separator"
import {Badge} from "@site/ui/badge"
import {createPortal} from "react-dom";
import {statusLabels} from "@/shared/components/localization.ts";
import {X, Trash2} from "lucide-react";

import {useEffect, useState} from "react";
import {cn} from "@site/ui/lib/utils";

export function SelectedRowsBar({
                                    count,
                                    selectedIds = [],
                                    statusesInfo = [],
                                    onClear,
                                    onBulkStatusChange = undefined,
                                    onBulkDelete = undefined,
                                    isPending = false,
                                }) {
    const [lastCount, setLastCount] = useState(0)

    useEffect(() => {
        if (count > 0) {
            setLastCount(count)
        }
    }, [count])

    const visible = count > 0
    const shown = count > 0 ? count : lastCount
    const statusActions = statusesInfo.filter(({label}) => label !== "all")

    const handleStatus = async (status: string) => {
        if (!onBulkStatusChange || !selectedIds.length || isPending) return;
        await onBulkStatusChange(selectedIds, status);
        onClear?.();
    }

    const handleDelete = async () => {
        if (!onBulkDelete || !selectedIds.length || isPending) return;
        if (!window.confirm(`Удалить выбранные позиции (${selectedIds.length})? Действие нельзя отменить.`)) {
            return;
        }
        await onBulkDelete(selectedIds);
        onClear?.();
    }

    return createPortal(
        <div
            role="toolbar"
            aria-hidden={!visible}
            className={cn(
                "fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background/95 p-2 px-4 shadow-xl backdrop-blur",
                "transition-all duration-300 ease-out",
                visible
                    ? "translate-y-0 opacity-100 scale-100"
                    : "pointer-events-none translate-y-6 opacity-0 scale-95"
            )}
        >
            <div className="flex items-center gap-2 pr-1 text-sm font-medium">
                <span>Выбрано:</span>
                <Badge
                    variant="secondary"
                    className="h-5 w-8 justify-center rounded-full px-0 py-0 text-xs font-semibold leading-none tabular-nums"
                >
                    {shown > 99 ? "99+" : shown}
                </Badge>
            </div>

            {onBulkStatusChange && statusActions.length > 0 && (
                <>
                    <Separator orientation="vertical"/>
                    <div className="flex items-center gap-1">
                        {statusActions.map(({label}) => (
                            <Button
                                key={label}
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleStatus(label)}
                                className="h-8 rounded-full"
                            >
                                {statusLabels[label] ?? label}
                            </Button>
                        ))}
                    </div>
                </>
            )}

            {onBulkDelete && (
                <>
                    <Separator orientation="vertical"/>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={handleDelete}
                        className="h-8 rounded-full gap-1.5"
                    >
                        <Trash2 className="h-3.5 w-3.5"/>
                        Удалить
                    </Button>
                </>
            )}

            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClear}>
                <X className="h-4 w-4"/>
                <span className="sr-only">Снять выделение</span>
            </Button>
        </div>,
        document.body
    )
}
