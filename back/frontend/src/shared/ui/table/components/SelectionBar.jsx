import {Button} from '../../Button.jsx'
import {X} from 'lucide-react'

export function SelectionBar({selectedCount, categories, onClear}) {
    return (
        <div
            className={`
                flex
                gap-3
                fixed
                left-1/2
                transition-all 
                duration-200
                -translate-x-1/2
                ease-out
                bottom-20
                h-min
                p-4
                py-2
                items-center
                rounded-2xl
                w-min
                bg-black
                text-white
                ${selectedCount > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
                `}
        >
            <span
                className="flex font-medium whitespace-nowrap"
            >
                Выбрано: {selectedCount}
            </span>
            <div className={`
                                     relative
                                     w-[1px] h-6 bg-muted/40 rounded-lg
                                `}>
            </div>
            {[...categories].map(category => (
                <Button
                    key={category}
                    text={category}
                    className="
                        "
                />
            ))}
            <Button variant='danger' text='Удалить'/>

            <X
                className={`
                        transition-all 
                        duration-200
                        w-7 p-1 h-7 
                        flex items-center 
                        justify-center rounded-full 
                        cursor-pointer hover:bg-muted/20
                        hover:brightness-110 
                        active:scale-98
                        `}
                onClick={onClear}
            />
        </div>
    )
}
