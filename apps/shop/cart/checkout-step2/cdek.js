export function initCdekWidget() {
    const container = document.getElementById('cdek-calc-container');
    if (!container) return;

    const cityFrom = 418; // ID твоего города отправки
    const weight = getCartWeight();

    const params = new URLSearchParams({
        oplata: 1,
        city_from: cityFrom,
        weight: weight,
        length: 10,
        width: 10,
        height: 10,
    });

    container.innerHTML = `
        <iframe 
            src="https://kit.cdek-calc.ru/calc.php?${params.toString()}"
            scrolling="no" 
            frameborder="0"
        >
        </iframe>
    `;
}

function getCartWeight() {
    return 1;
}