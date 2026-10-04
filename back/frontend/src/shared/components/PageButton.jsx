/* ============================================================================
   PageButton — базовая кнопка админки.

   Единственный компонент, оставшийся «общим» из бывшего Ui.jsx:
   он нужен и таблице, и карточке товара, и остальным фичам.
   Всё остальное из Ui.jsx разъехалось по своим местам:
     • AsideButton → features/dashboard/components/AsideButton.jsx
     • фильтр/поиск/таблица товаров → features/goods/components/
     • мок списка товаров → features/goods/mocks/goodsList.js
   ============================================================================ */

export function PageButton({
                               children,
                               text,
                               onClick,
                               className = '',
                               variant = 'default',
                               type = 'button',
                           }) {
    const styles = `
    flex 
    items-center 
    justify-center
    gap-3 
    rounded-xl 
    p-2
    cursor-pointer
    transition-all
    duration-200
    font-medium
    ease-out
    hover:brightness-110 
    active:scale-98
    border-2
    border-border2
    hover:bg-muted/20
    ${className}
    ${variant === 'accent' ? " bg-blue-500 text-white" : ""}
    ${variant === 'danger' ? " text-red-500 hover:bg-red-500/20" : ""}
    `;

    return (
        <button type={type} className={styles} onClick={onClick}>
            {children}
            {text && <span>{text}</span>}
        </button>
    );
}
