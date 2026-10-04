import {NavLink} from "react-router-dom";
import {twMerge} from "tailwind-merge";

/* Пункт навигации сайдбара: ссылка с подсветкой активного раздела.
   Раньше жил в shared/Ui.jsx, хотя нужен только сайдбару дашборда. */
export function AsideButton({children, text, to, className = ''}) {
    const getStyles = isActive => twMerge(`
        flex 
        items-center 
        gap-3 
        text-muted 
        rounded-xl 
        p-1 
        transition-all
        duration-150
        ease-out
        hover:scale-102 hover:brightness-110 
        active:scale-98
        ${isActive ? 'bg-white text-black font-semibold' : 'hover:bg-blue-600/40 hover:text-white'}
        ${className}
    `);

    if (to) {
        return (
            <NavLink to={to} className={({isActive}) => getStyles(isActive)}>
                {children}
                {text && <span className="font-medium">{text}</span>}
            </NavLink>
        );
    }
}
