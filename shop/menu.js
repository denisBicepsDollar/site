const menuButton = document.getElementById('menu-button');
const menu = document.getElementById('site-menu');

menuButton.addEventListener('click', function() {

    menu.classList.toggle('menu--open');

    const isOpen = menu.classList.contains('menu--open');

    menuButton.textContent = isOpen ? 'Закрыть': 'Открыть меню';
});

document.addEventListener('click', function(event) {

    const clickInsideMenu = menu.contains(event.target);

    const clickOnButton = menuButton.contains(event.target);

    if (!clickInsideMenu && !clickOnButton) {
        menu.classList.remove('menu--open');
        menuButton.textContent = 'Открыть меню';
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        menu.classList.remove('menu--open');
        menuButton.textContent = 'Открыть меню';
    };
});

const menuLinks = document.querySelectorAll('.menu__link');

menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        menu.classList.remove('menu--open');
        menuButton.textContent = 'Открыть меню';
    });
});


