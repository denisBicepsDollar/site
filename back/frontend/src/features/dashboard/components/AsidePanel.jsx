import icon from '/icon.png'
import { AsideButton } from '../../../shared/components/Ui.jsx'
import {useState} from "react";


export default function AsidePanel() {
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);


    return (
        <aside
            className={`
            min-h-screen
            flex
            w-25
            ease-in-out
            ${isHovered || isPinned ? "w-67" : "w-25"}
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
                <div className="

                    flex
                    flex-row
                    ">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="text-muted
                                     cursor-pointer
                                     w-9
                                     h-9
                                     transition-all
                                     duration-150
                                     ease-out
                                     hover:scale-102 hover:brightness-110
                                     active:scale-98
                                     rendering-geometric
                                     hover:bg-blue-600/80
                                     hover:text-white
                                     rounded-xl

                                     border-2 border-border2
                                     p-1">
                            <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
                            <path
                                d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                        </svg>
                    </button>
                    <div className="
                        rounded-2xl
                        flex
                        justify-center
                        transition-all
                        duration-150
                        ease-out
                        shrink-0


                        ">
                        <img
                            src={icon}
                            alt="icon"
                            className=" w-11 border-accent2 border-2 rounded-3xl"/>
                    </div>

                    <div className="flex gap-4 justify-center items-center">
                        <span
                            className={`
                                text-white
                                whitespace-nowrap
                                ml-3
                                font-medium
                                text-lg
                                ${isHovered || isPinned ? "w-auto opacity-100" : "w-0 opacity-0 pointer-events-none"}
                                `}>
                                Зеленые усы
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             onClick={() => setIsPinned(!isPinned)}
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
                             ${isHovered || isPinned ? "w-7 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
                            {isPinned ? (
                                <>
                                    <path d="M12 17v5"/>
                                    <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"/>
                                    <path d="m2 2 20 20"/>
                                    <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/>

                                </>
                            ) : (
                                <>
                                    <path d="M12 17v5"/>
                                    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
                                </>
                            )}
                        </svg>

                    </div>
                </div>
                <hr className="border-t border-white/20"/>
                <nav className="
                    flex
                    flex-1
                    flex-col
                    gap-3
                ">
                    <AsideButton to="goods" className={"overflow-hidden"} text={"Товары"}>
                        <div className="
                            cursor-pointer
                            p-2
                            ">
                            <svg
                                xmlns="http://www.w3.org/" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                className="w-5 h-5  rendering-geometric ">
                                <path stroke-linecap="miter" d="
                                M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z
                                "/>
                                <path d="M12 22V12"></path>
                                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                                <path d="m7.5 4.27 9 5.15"></path>
                            </svg>
                        </div>
                    </AsideButton>
                    <AsideButton to="orders" className={"overflow-hidden"} text={"Заказы"}>
                        <div className="
                            p-2
                            ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 className="w-5 h-5  rendering-geometric">
                                <rect width="18" height="18" x="3" y="3" rx="2"/>
                                <path d="M7 8h8"/>
                                <path d="M7 12h10"/>
                                <path d="M7 16h6"/>
                            </svg>

                        </div>
                    </AsideButton>
                    <AsideButton to="messages" className={"overflow-hidden"} text={"Обращения"}>
                        <div className="
                            p-2
                            ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 className="w-5 h-5  rendering-geometric">
                                <path
                                    d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                <path
                                    d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/>
                            </svg>
                        </div>

                    </AsideButton>
                    <AsideButton to="settings" className={"overflow-hidden"} text={"Настройки"}>
                        <div className="
                            p-2
                            ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 className="w-5 h-5  rendering-geometric">
                                <path d="M14 17H5"/>
                                <path d="M19 7h-9"/>
                                <circle cx="17" cy="17" r="3"/>
                                <circle cx="7" cy="7" r="3"/>
                            </svg>
                        </div>
                    </AsideButton>
                </nav>
                <hr className="border-t border-white/20"/>
                <AsideButton
                    to="localhost"
                    className="whitespace-nowrap overflow-hidden"
                    text={"Перейти в магазин"}>
                    <div className="

                            p-2
                            ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="w-5 h-5  rendering-geometric">
                            <path d="M7 7h10v10"/>
                            <path d="M7 17 17 7"/>
                        </svg>
                    </div>
                </AsideButton>
            </div>
        </aside>
    );
}