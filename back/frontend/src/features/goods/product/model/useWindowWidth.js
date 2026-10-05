import {useEffect, useState} from "react";
import {BREAKPOINTS} from "../constants.js";


export function useWindowWidth(debounceMs = 150) {
    const [width, setWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        let timeoutId = null;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setWidth(window.innerWidth), debounceMs);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };

    }, [debounceMs])
    return width;
}

export function useBreakpoint() {
    const width = useWindowWidth();

    for (const [name, minWidth] of Object.entries(BREAKPOINTS)) {
        if (width > minWidth) return name;
    }
    return "xs";
}