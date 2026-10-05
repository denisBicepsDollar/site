// Иконка закрепления панели: переключает фиксированное раскрытие
export default function AsidePinButton({isExpanded, isPinned, onTogglePin}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             onClick={onTogglePin}
             className={`
                             text-muted 
                             cursor-pointer
                             w-7
                             h-7
                             transition-all
                             duration-150
                             ease-out
                             hover:scale-102 hover:brightness-110 
                             active:scale-98
                             rendering-geometric 
                             hover:bg-blue-600/40 
                             hover:text-white
                             rounded-xl 
                             p-1
                             ${isExpanded ? "w-7 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
            {isPinned ? (
                <>
                    <path d="M12 17v5"/>
                    <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"/>
                    <path d="m2 2 20 20"/>
                    <path
                        d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/>

                </>
            ) : (
                <>
                    <path d="M12 17v5"/>
                    <path
                        d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
                </>
            )}
        </svg>
    );
}
