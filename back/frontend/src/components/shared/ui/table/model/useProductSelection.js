import {useCallback, useState} from 'react'

export function useProductSelection(items = []) {
    const [selectedIds, setSelectedIds] = useState([])

    const isAllSelected =
        items.length > 0 && items.every(item => selectedIds.includes(item.id))

    const toggle = useCallback(
        id => {
            setSelectedIds(prev => {
                if (prev.includes(id)) {
                    return prev.filter(itemId => itemId !== id)
                }

                // В исходнике сюда прилетал булев флаг из шапки таблицы.
                if (typeof id === 'boolean') {
                    if (id === false) {
                        return []
                    }

                    const allIds = [...prev]
                    for (const item of items) {
                        if (!prev.includes(item.id)) {
                            allIds.push(item.id)
                        }
                    }
                    return allIds
                }

                return [...prev, id]
            })
        },
        [items],
    )

    const clear = useCallback(() => setSelectedIds([]), [])

    return {selectedIds, isAllSelected, toggle, clear}
}
