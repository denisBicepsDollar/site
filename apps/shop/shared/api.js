export async function getProducts(p = {}) {
    try {
        // 1. Делаем запрос к серверу (автоматически формируя строку ?key=value)
        const response = await fetch(`/api/products?${new URLSearchParams(p)}`);

        // 2. Проверяем, успешен ли ответ сервера (статус 200-299)
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
        }
        // 3. Распаковываем JSON и возвращаем его наружу
        return await response.json();

    } catch (error) {
        console.error("Ошибка в getProducts при запросе к API:", error);
        // Возвращаем пустой массив, чтобы приложение не падало у пользователя
        return [];
    }
}