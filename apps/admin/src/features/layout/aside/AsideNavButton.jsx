import {twMerge} from 'tailwind-merge'
import {NavLink} from 'react-router-dom'

export function AsideNavButton({icon: Icon, text, to, className = '', isExpanded, onClick}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({isActive}) => twMerge(
                // Базовые структурные классы НЕ меняются. Кнопка всегда w-full и h-11.
                'w-full h-11 rounded-xl flex items-center justify-start select-none',
                'px-[18px] gap-3 overflow-hidden transition-all duration-300 ease-in-out',
                'active:scale-[0.96] shrink-0',

                isActive
                    ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.15)] font-semibold'
                    : 'text-[#8E8E93] hover:bg-white/5 hover:text-white',
                className,
            )}
        >
            {({isActive}) => (
                <>
                    {Icon && (
                        <Icon className={`
                            h-5 w-5 shrink-0 transition-transform duration-300
                            ${isActive ? 'scale-105' : ''}
                        `}/>
                    )}

                    {/*
                      Текст плавно увеличивает свою максимальную ширину и проявляется.
                      max-w-0 предотвращает перенос текста на вторую строку во время анимации.
                    */}
                    <span className={`
                        text-sm font-medium whitespace-nowrap truncate
                        transition-all duration-300 ease-in-out
                        ${isExpanded
                        ? 'opacity-100 translate-x-0 max-w-[160px]'
                        : 'opacity-0 -translate-x-4 max-w-0 pointer-events-none'
                    }
                    `}>
                        {text}
                    </span>
                </>
            )}
        </NavLink>
    )
}