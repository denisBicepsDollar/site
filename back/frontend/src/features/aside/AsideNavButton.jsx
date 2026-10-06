import {twMerge} from 'tailwind-merge'
import {NavLink} from 'react-router-dom'

export function AsideNavButton({icon: Icon, text, to, className = ''}) {
    return (
        <NavLink
            to={to}
            className={({isActive}) => twMerge(
                'flex items-center gap-3 rounded-xl p-1 transition-all duration-150 ease-out',
                'hover:scale-102 hover:brightness-110 active:scale-98 overflow-hidden',
                isActive
                    ? 'bg-white font-semibold text-black'
                    : 'text-muted hover:bg-blue-600/40 hover:text-white',
                className,
            )}
        >
            {Icon && (
                <div className="p-2">
                    <Icon className="h-5 w-5 rendering-geometric"/>
                </div>
            )}
            {text && <span className="font-medium">{text}</span>}
        </NavLink>
    )
}