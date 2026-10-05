import {AsideButton} from '../../../../shared/components/Ui.jsx'

// Пункт навигации боковой панели
export default function AsideNavItem({to, text, icon, iconClassName}) {
    return (
        <AsideButton to={to} className={"overflow-hidden"} text={text}>
            <div className={iconClassName}>
                {icon}
            </div>
        </AsideButton>
    );
}
