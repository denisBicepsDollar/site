document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const menu = document.getElementById('site-menu');
    let isAnimating = false;
    if (!menuButton || !menu) return;

    // Ищем span внутри кнопки
    const label = menuButton.querySelector('.header__label');

    function setLabel(text) {
        if (label) {
            label.textContent = text;
        } else {
            menuButton.textContent = text;
        }
    }

    menuButton.addEventListener('click', function() {
        if (isAnimating) return;  // игнорируй клик если уже обрабатываем
        isAnimating = true;
        menu.classList.toggle('menu--open');
        const isOpen = menu.classList.contains('menu--open');
        menuButton.setAttribute('aria-expanded', isOpen);
        setLabel(isOpen ? 'Закрыть' : 'Открыть меню');

        setTimeout(() => { isAnimating = false; }, 100); // 300ms = время анимации
    });

    document.addEventListener('click', function(event) {
        const clickInsideMenu = menu.contains(event.target);
        const clickOnButton = menuButton.contains(event.target);
        if (!clickInsideMenu && !clickOnButton) {
            menu.classList.remove('menu--open');
            menuButton.setAttribute('aria-expanded', false);
            setLabel('Открыть меню');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            menu.classList.remove('menu--open');
            menuButton.setAttribute('aria-expanded', false);
            setLabel('Открыть меню');
        }
    });

    const menuLinks = document.querySelectorAll('.menu__link');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('menu--open');
            menuButton.setAttribute('aria-expanded', false);
            setLabel('Открыть меню');
        });
    });
});