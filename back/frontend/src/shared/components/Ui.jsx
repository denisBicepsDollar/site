import { twMerge } from 'tailwind-merge';
import { NavLink } from 'react-router-dom';

export function AsideButton({
                                children,
                                text,
                                to,
                                variant = 'default',
                                onClick,
                                className = '',
                                isActive: isDefaultActive = false // переименовали дефолтный пропс, чтобы не путаться
                            }) {

    const getStyles = (active) => twMerge(`
        flex 
        items-center 
        gap-3 
        text-muted 
        rounded-xl 
        p-1 
        ${active ? 'bg-white text-black font-semibold' : 'hover:bg-blue-600/40 hover:text-white'}
        ${className}
    `);

    function handleClick(e) {
        if (onClick) {
            onClick(e);
        }
    }

    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) => getStyles(isActive)}
                onClick={handleClick}
            >
                {children}
                <span className="font-medium p-2">
                    {text}
                </span>
            </NavLink>
        );
    }

    return (
        <button
            className={getStyles(isDefaultActive)}
            onClick={handleClick}
            data-selected={isDefaultActive}
        >
            {children}
            <span className="font-medium p-2">
                {text}
            </span>
        </button>
    );
}
