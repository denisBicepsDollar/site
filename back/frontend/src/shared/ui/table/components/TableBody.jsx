import {TableRow} from './TableRow.jsx'

/**
 * ВАЖНО: строки рендерятся фрагментом, чтобы попасть ровно в тот же
 * flex-контейнер с gap-0.5, что и в исходнике (переключалка страниц — его
 * сосед, а не вложенный элемент). Никаких новых div-обёрток здесь нет.
 */
export function TableBody({items, selectedIds, onToggle}) {
    return (
        <>
            {items.map(item => (
                <TableRow
                    key={item.id}
                    item={item}
                    selected={selectedIds.includes(item.id)}
                    onToggle={onToggle}
                />
            ))}
        </>
    )
}
