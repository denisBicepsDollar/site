import {Button} from "@/components/ui/button.jsx";
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {createPortal} from "react-dom";
import {X, Trash2} from "lucide-react";


export function SelectedRowsBar({count, statuses, onClear}) {
    if (!count) return null

    return createPortal(
        <div
            className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background/95 p-2 px-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 pr-1 text-sm font-medium">
                <span>Выбрано:</span>
                <Badge variant="secondary" className="rounded-full px-2">
                    {count}
                </Badge>
            </div>

            <Separator orientation="vertical" className="h-5"/>

            <div className="flex items-center gap-1">
                {statuses.map((status) => (
                    <Button key={status} variant="ghost" size="sm" className="h-8 rounded-full">
                        {status}
                    </Button>
                ))}
            </div>

            <Separator orientation="vertical" className="h-5"/>

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
