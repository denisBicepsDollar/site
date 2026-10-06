import {Checkbox} from './Checkbox.jsx'

export function TableHeader({
                                isAllSelected,
                                onToggleAll,
                                headerTitles
                            }) {
    return (
        <div className="
                    flex
                    w-full
                    border-b-2
                    bg-white
                    border-stone-200
                    py-3
                    tracking-wider
                    uppercase
                    text-muted
                    text-xs
                    font-medium
                    px-4">
            <Checkbox
                variant="dash"
                checked={isAllSelected}
                onChange={onToggleAll}
            />

            {headerTitles.map(column => (
                <div key={column.key} className={column.className}>{column.title}</div>
            ))}
        </div>
    )
}
