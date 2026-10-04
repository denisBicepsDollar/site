import {X} from "lucide-react";
import {PageButton} from "../../../shared/components/PageButton.jsx";

/* Плавающая плашка внизу: сколько товаров выбрано и что с ними сделать */
export function GoodsSelectionBar({selectedIds, statuses, onClear}) {
    const hasSelection = selectedIds.length > 0;

    return (
        <div className={`fixed bottom-20 left-1/2 flex h-min w-min -translate-x-1/2 items-center gap-3
                         rounded-2xl bg-black p-4 py-2 text-white transition-all duration-200 ease-out
                         ${hasSelection ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
            <span className="flex whitespace-nowrap font-medium">
                Выбрано: {selectedIds.length}
            </span>

            <div className="relative h-6 w-[1px] rounded-lg bg-muted/40"/>

            {statuses.map(status => (
                <PageButton key={status} text={status}/>
            ))}

            <PageButton variant='danger' text='Удалить'/>

            <button
                type="button"
                aria-label="Снять выделение"
                onClick={onClear}
                className="flex h-7 w-7 items-center justify-center rounded-full p-1 transition-all
                           duration-200 hover:bg-muted/20 hover:brightness-110 active:scale-98">
                <X className="h-5 w-5"/>
            </button>
        </div>
    );
}
