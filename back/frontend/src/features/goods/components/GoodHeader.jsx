import {ArrowLeft, Save} from "lucide-react";
import {PageButton} from "../../../shared/components/Ui.jsx";

/* Верхняя прилипающая панель: хлебные крошки, индикатор изменений и «Сохранить» */
export function GoodHeader({name, hasChanges, onBack, onSave}) {
    return (
        <div className="sticky top-0 z-30 flex w-full flex-col gap-3 border-b border-zinc-200
                        bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
                <PageButton text="К товарам" onClick={onBack}>
                    <ArrowLeft className="w-5 h-5" aria-hidden="true"/>
                </PageButton>
                <span className="font-medium">/</span>
                <span className="font-medium text-xl">{name}</span>
            </div>

            <div className="flex flex-row items-center">
                <span>
                    {hasChanges ? "Изменения не сохранены" : "Изменений нет"}
                </span>
                <PageButton text="Сохранить" onClick={onSave}>
                    <Save className="w-5 h-5" aria-hidden="true"/>
                </PageButton>
            </div>
        </div>
    );
}