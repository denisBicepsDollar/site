import {ArrowLeft, Save} from "lucide-react";
import {Button} from "../../../../shared/ui/Button.jsx";

/* Верхняя прилипающая панель: хлебные крошки, индикатор изменений и «Сохранить» */
export function ProductHeader({name, hasChanges, onBack, onSave}) {
    return (
        <div className="flex w-full flex-col gap-3 border-b border-zinc-200
                bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
                <Button text="К товарам" onClick={onBack}>
                    <ArrowLeft className="w-5 h-5" aria-hidden="true"/>
                </Button>
                <span className="font-medium">/</span>
                <span className="font-medium text-xl">{name}</span>
            </div>

            <div className="flex flex-row items-center gap-3">
                <div
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium border transition-colors ${
                        hasChanges
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50"
                            : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/50"
                    }`}
                >
        <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                hasChanges ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
        />
                    {hasChanges ? "Изменения не сохранены" : "Изменений нет"}
                </div>

                <Button
                    text="Сохранить"
                    onClick={onSave}
                    disabled={!hasChanges} // Отключает кнопку, если сохранять нечего
                >
                    <Save className="h-5 w-5" aria-hidden="true"/>
                </Button>
            </div>

        </div>
    );
}