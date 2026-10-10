import {Button} from "@/shared/ui/actions/button.jsx";
import {Separator} from "@/shared/ui/display/separator.jsx"
import {Badge} from "@/shared/ui/display/badge.jsx"
import {createPortal} from "react-dom";
import {statusLabels} from "@/shared/components/localization.jsx";
import {X, Trash2} from "lucide-react";

import {useState} from "react";
import {cn} from "@/shared/lib/utils.js";


export function SelectedRowsBar({count, statusesInfo, onClear}) {
    console.log(statusesInfo)
    const [lastCount, setLastCount] = useState(0)
    if (count > 0 && count !== lastCount) {
        setLastCount(count)
    }
    const visible = count > 0
    const shown = count > 0 ? count : lastCount

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

            <Separator orientation="vertical"/>

            <div className="flex items-center gap-1">
                {statusesInfo.filter(({label}) => label !== 'all').map(({label}) => (
                    <Button key={label} variant="ghost" size="sm" className="h-8 rounded-full">
                        {statusLabels[label]}
                    </Button>
                ))}
            </div>

            <Separator orientation="vertical"/>

            <Button variant="destructive" size="sm" className="h-8 rounded-full gap-1.5">
                <Trash2 className="h-3.5 w-3.5"/>
                Удалить
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClear}>
                <X className="h-4 w-4"/>
                <span className="sr-only">Снять выделение</span>
            </Button>
        </div>,
        document.body
    )
}
