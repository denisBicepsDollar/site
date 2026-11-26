import icon from '/icon.png'
import {useState} from 'react'
import {ArrowUpRight, LogOut, Pin, PinOff, Menu, X} from 'lucide-react'
import {useQueryClient} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'
import {AsideNavButton} from './AsideNavButton'
import {dashboardNavigation} from "../config/navigation";
import {authApi} from "@/shared/api/auth/authApi.ts";

const ICON_BTN = [
    'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl',
    'text-[#8E8E93] transition-all duration-200 ease-out',
    'hover:bg-white/10 hover:text-white active:scale-95',
].join(' ')

export function Sidebar() {
    const [isHovered, setIsHovered] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const isExpanded = isHovered || isPinned
    const PinIcon = isPinned ? PinOff : Pin

    const handleLogout = async () => {
        if (isLoggingOut) return
        setIsLoggingOut(true)
        try {
            await authApi.logout()
        } catch {
            // Игнорируем сетевую ошибку при выходе и всё равно сбрасываем локальную сессию
        } finally {
            queryClient.clear()
            setIsMobileOpen(false)
            setIsLoggingOut(false)
            navigate('/', {replace: true})
        }
    }

    return (
        <>
            {/* 1. Кнопка «Меню» для мобильных устройств */}
            <div className="md:hidden fixed top-4 left-4 z-30">
                <button
                    type="button"
                    aria-label="Открыть меню"
                    onClick={() => setIsMobileOpen(true)}
                    className="
                        flex h-11 w-11 items-center justify-center rounded-2xl
                        border border-white/10 bg-black/60 text-white backdrop-blur-md
                        shadow-lg active:scale-90 transition-all duration-200
                        cursor-pointer
                    "
                >
                    <Menu className="h-6 w-6"/>
                </button>
            </div>

            {/* 2. Затемнение фона (Плавный Fade) */}
            <div
                onClick={() => setIsMobileOpen(false)}
                className={`
                    md:hidden fixed inset-0 z-40
                    bg-black/60 backdrop-blur-sm
                    transition-opacity duration-300 ease-in-out
                    ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
            />

            {/* 3. Мобильная выдвижная шторка */}
            <div
                className={`
                    md:hidden fixed inset-y-0 left-0 z-50 w-72 
                    bg-[#1C1C1E] p-6 pr-8 flex flex-col gap-4
                    shadow-[4px_0_24px_rgba(0,0,0,0.5)]
                    transition-transform duration-300 ease-in-out transform
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <button
                    type="button"
                    aria-label="Закрыть меню"
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute top-4 right-4 p-2 text-[#8E8E93] active:scale-90 transition-transform cursor-pointer"
                >
                    <X className="h-6 w-6"/>
                </button>

                <div className="flex items-center gap-3 px-2 mt-4">
                    <img
                        src={icon}
                        alt="icon"
                        className="h-10 w-10 shrink-0 rounded-[14px] border border-white/10"
                    />
                    <span className="whitespace-nowrap font-semibold text-lg text-white">
                        Зеленые усы
                    </span>
                </div>

                <hr className="border-t border-white/5 mx-2 my-2"/>

                <nav className="flex flex-1 flex-col gap-2">
                    {dashboardNavigation.map(({to, label, icon}) => (
                        <AsideNavButton
                            key={to}
                            to={to}
                            text={label}
                            icon={icon}
                            isExpanded={true}
                            onClick={() => setIsMobileOpen(false)}
                        />
                    ))}
                </nav>

                <hr className="border-t border-white/5 mx-2"/>

                <div className="flex flex-col gap-1">
                    <AsideNavButton
                        to="https://zelenyeusy.ru"
                        text="В магазин"
                        icon={ArrowUpRight}
                        isExpanded={true}
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <AsideNavButton
                        text={isLoggingOut ? "Выход..." : "Выйти"}
                        icon={LogOut}
                        isExpanded={true}
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="hover:bg-[#FF3B30]/15 hover:text-[#FF453A]"
                    />
                </div>
            </div>

            {/*
              4. Десктопная панель
            */}
            <aside
                className={`
                    hidden md:flex sticky top-0 h-screen shrink-0 bg-black transition-all duration-300 ease-in-out
                    ${isExpanded ? 'w-60' : 'w-20'}
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="flex h-full w-full flex-col gap-4 overflow-hidden bg-[#1C1C1E] p-3 transition-all duration-300">

                    {/* Шапка (Всегда стабильные размеры) */}
                    <div className="flex items-center w-full px-[10px] h-11 justify-between relative shrink-0">
                        <div className="flex items-center gap-4 w-full">
                            <img
                                src={icon}
                                alt="icon"
                                className="h-9 w-9 shrink-0 rounded-[12px] border border-white/10 shadow-sm"
                            />
                            <span className={`
                                whitespace-nowrap font-semibold text-base text-white
                                transition-all duration-300 ease-in-out
                                ${isExpanded ? 'opacity-100 translate-x-0 max-w-[150px]' : 'opacity-0 -translate-x-4 max-w-0 pointer-events-none'}
                            `}>
                                Зеленые усы
                            </span>
                            {/* Кнопка пина */}
                            <button
                                type="button"
                                aria-label={isPinned ? "Открепить панель" : "Закрепить панель"}
                                onClick={() => setIsPinned(v => !v)}
                                className={`
                                    ${ICON_BTN} transition-all duration-300 ease-in-out
                                    ${isPinned ? 'bg-white/10 text-white' : ''}
                                    ${isExpanded ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none w-0 overflow-hidden'}
                                `}
                            >
                                <PinIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>

                    <hr className="border-t border-white/5 mx-2 shrink-0"/>

                    {/* Навигация */}
                    <nav className="flex flex-1 flex-col gap-2 overflow-y-auto no-scrollbar">
                        {dashboardNavigation.map(({to, label, icon}) => (
                            <AsideNavButton
                                key={to}
                                to={to}
                                text={label}
                                icon={icon}
                                isExpanded={isExpanded}
                            />
                        ))}
                    </nav>

                    <hr className="border-t border-white/5 mx-2 shrink-0"/>

                    <div className="flex flex-col gap-1 shrink-0">
                        <AsideNavButton
                            to="https://zelenyeusy.ru"
                            text="В магазин"
                            icon={ArrowUpRight}
                            isExpanded={isExpanded}
                        />
                        <AsideNavButton
                            text={isLoggingOut ? "Выход..." : "Выйти"}
                            icon={LogOut}
                            isExpanded={isExpanded}
                            disabled={isLoggingOut}
                            onClick={handleLogout}
                            className="hover:bg-[#FF3B30]/15 hover:text-[#FF453A]"
                        />
                    </div>
                </div>
            </aside>
        </>
    )
}
