import {useEffect, useState} from 'react'

// Сколько строк влезает на страницу при текущей ширине окна.
export function useResponsiveItemsPerPage() {
    const [itemsPerPage, setItemsPerPage] = useState(4)

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth

            if (width < 640) {
                setItemsPerPage(4)
            } else if (width < 1600) {
                setItemsPerPage(5)
            } else {
                setItemsPerPage(8)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return [itemsPerPage, setItemsPerPage]
}
