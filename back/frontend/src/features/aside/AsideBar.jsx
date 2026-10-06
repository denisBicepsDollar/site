import icon from '/icon.png'
import {useState} from 'react'
import {ArrowUpRight, Bell, Pin, PinOff,} from 'lucide-react'
import {AsideNavButton} from './AsideNavButton.jsx'
import {dashboardNavigation} from "../config/navigation.js";

// общая кнопка-иконка для шапки (колокольчик, пин)
const ICON_BTN = [
    'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl',
    'text-muted rendering-geometric transition-all duration-150 ease-out',
    'hover:scale-102 hover:bg-blue-600/40 hover:text-white active:scale-98',
].join(' ')

export default function AsideBar() {
    const [isHovered, setIsHovered] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const isExpanded = isHovered || isPinned

    // закреплён — перечёркнутый пин, откреплён — обычный
    const PinIcon = isPinned ? PinOff : Pin

    return (
        <aside
            className={`min-h-screen shrink-0 bg-primary transition-all duration-150 ease-in-out ${isExpanded ? 'w-67' : 'w-25'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="flex h-full flex-col gap-3 overflow-hidden bg-space-black p-6 pr-8 transition-all duration-300 ease-in-out">
                {/* шапка: лого + название */}
                <div className={`flex items-center gap-3 ${isExpanded ? '' : 'justify-center'}`}>
                    <img
                        src={icon}
                        alt="icon"
                        className="h-11 w-11 shrink-0 rounded-3xl border-2 border-accent2"
                    />
                    <span className={`whitespace-nowrap font-medium text-lg text-white ${isExpanded ? '' : 'hidden'}`}>
                        Зеленые усы
                    </span>
                </div>

                {/* шапка: действия (колокольчик + пин) */}
                <div className={`items-center justify-between ${isExpanded ? 'flex' : 'hidden'}`}>
                    <button className={ICON_BTN} title="Уведомления">
                        <Bell className="h-5 w-5"/>
                    </button>

                    <button
                        onClick={() => setIsPinned(v => !v)}
                        className={`${ICON_BTN} ${isPinned ? 'bg-blue-600/40 text-white' : ''}`}
                        title={isPinned ? 'Открепить панель' : 'Закрепить панель'}
                    >
                        <PinIcon className="h-5 w-5"/>
                    </button>
                </div>

                <hr className="border-t border-white/20"/>

                {/* навигация */}
                <nav className="flex flex-1 flex-col gap-3">
                    {dashboardNavigation.map(({to, label, icon}) => (
                        <AsideNavButton key={to} to={to} text={label} icon={icon}/>
                    ))}
                </nav>

                <hr className="border-t border-white/20"/>

                <AsideNavButton
                    to="localhost"
                    text="Перейти в магазин"
                    icon={ArrowUpRight}
                    className="whitespace-nowrap"
                />
            </div>
        </aside>
    )
}