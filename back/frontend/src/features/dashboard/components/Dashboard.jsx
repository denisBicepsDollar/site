import icon from '/icon.png'
import { AsideButton } from '../../../shared/components/Ui.jsx'
import {useState} from "react";
import {NavLink, Outlet} from 'react-router-dom';


export default function Dashboard() {

    return (
        <aside
            className="
            min-h-screen
            flex
            bg-primary">
            <div className="
            min-h-screen
            flex
            flex-col
            gap-3
            justify-start
            p-6
            pr-8
            bg-space-black">
                <button className="
                    flex
                    items-center
                    justify-center
                    flex-row
                    gap-3">
                        <div className="
                        h-min
                        flex
                        bg-accent2
                        rounded-2xl
                        p-0.5
                        ">
                            <img
                                src={icon}
                                alt="icon"
                                className="w-8 shrink-0"/>
                        </div>
                        <span
                            className="
                            text-white
                            flex
                            font-medium
                            text-lg
                            ">
                            Зеленые усы
                        </span>
                </button>
                <hr className="border-t border-white/20" />
                <nav className="
                    flex
                    flex-1
                    flex-col
                    gap-3
                ">
                    <AsideButton to="goods" text="Товары">
                        <div className="

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
                    <AsideButton to="orders" text="Заказы">
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
                    <AsideButton to="messages" text='Обращения'>
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
                    <AsideButton to="settings" text="Настройки">
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
                    text="Перейти в магазин">
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
            <Outlet />
        </aside>

    );

}