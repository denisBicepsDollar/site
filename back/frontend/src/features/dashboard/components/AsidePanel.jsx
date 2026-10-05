import {useState} from "react";
import AsideHeader from "./aside/AsideHeader.jsx";
import AsideNav from "./aside/AsideNav.jsx";
import AsideShopLink from "./aside/AsideShopLink.jsx";

// Боковая панель админки: состояние раскрытия + раскладка секций
export default function AsidePanel() {
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const isExpanded = isHovered || isPinned;

    return (
        <aside
            className={`
            min-h-screen
            flex
            w-25
            ease-in-out
            ${isExpanded ? "w-67" : "w-25"}
            group
            transition-all
            duration-150
            bg-primary`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}

        >
            <div className="
            h-full
            flex
            flex-col
            gap-3
            justify-start
            p-6
            pr-8
            bg-space-black
            transition-all
            duration-300
            ease-in-out
            w-full
            overflow-hidden
            ">
                <AsideHeader
                    isExpanded={isExpanded}
                    isPinned={isPinned}
                    onTogglePin={() => setIsPinned(!isPinned)}
                />
                <hr className="border-t border-white/20"/>
                <AsideNav/>
                <hr className="border-t border-white/20"/>
                <AsideShopLink/>
            </div>
        </aside>
    );
}
