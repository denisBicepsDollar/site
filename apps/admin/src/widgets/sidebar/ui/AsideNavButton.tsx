import {twMerge} from 'tailwind-merge'
import {NavLink} from 'react-router-dom'

const BASE_CLASSES = [
    'w-full h-11 rounded-xl flex items-center justify-start select-none cursor-pointer',
    'px-[18px] gap-3 overflow-hidden transition-all duration-300 ease-in-out',
    'active:scale-[0.96] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

export function AsideNavButton({
    icon: Icon,
    text,
    to = undefined,
    className = '',
    isExpanded,
    onClick = undefined,
    disabled = false,
}) {
    const labelSpan = (
        <span
            className={`
                text-sm font-medium whitespace-nowrap truncate
                transition-all duration-300 ease-in-out
                ${isExpanded
                    ? 'opacity-100 translate-x-0 max-w-[160px]'
                    : 'opacity-0 -translate-x-4 max-w-0 pointer-events-none'
                }
            `}
        >
            {text}
        </span>
    );

    if (!to) {
        return (
            <button
                type="button"
                disabled={disabled}
                onClick={onClick}
                className={twMerge(BASE_CLASSES, 'text-[#8E8E93] hover:bg-white/5 hover:text-white', className)}
            >
                {Icon && <Icon className="h-5 w-5 shrink-0 transition-transform duration-300"/>}
                {labelSpan}
            </button>
        );
    }

    if (/^https?:\/\//i.test(to)) {
        return (
            <a
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className={twMerge(BASE_CLASSES, 'text-[#8E8E93] hover:bg-white/5 hover:text-white', className)}
            >
                {Icon && <Icon className="h-5 w-5 shrink-0 transition-transform duration-300"/>}
                {labelSpan}
            </a>
        );
    }

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({isActive}) => twMerge(
                BASE_CLASSES,
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
                    {labelSpan}
                </>
            )}
        </NavLink>
    )
}
