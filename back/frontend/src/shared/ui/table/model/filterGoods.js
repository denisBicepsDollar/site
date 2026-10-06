export function filterGoods(data, currentStatus, searchQuery) {
    const query = (searchQuery ?? '').toLowerCase().trim();
    console.log("Ищем строку:", `"${query}"`, "Тип:", typeof query);

    const step1 = data.filter(item => {
        const isMatch = currentStatus === 'all' ? true : item.status === currentStatus;
        return isMatch;
    });
    console.log("После фильтра статуса осталось элементов:", step1.length);

    const preData = step1.filter(item => {
        try {
            // Проверяем, не упал ли метод из-за отсутствия полей
            if (!item.name || !item.sku) {
                console.warn(`У товара с id: ${item.id} отсутствует name или sku!`, item);
                return false;
            }

            const name = item.name.toLowerCase().trim();
            const sku = item.sku.toLowerCase().trim();

            // Если поиск пустой, сразу возвращаем true
            if (query === '') return true;

            return name.includes(query) || sku.includes(query);
        } catch (error) {
            console.error(`Ошибка фильтрации на элементе id: ${item?.id}`, error);
            return false;
        }
    });

    console.log("Итог фильтрации:", preData);
    return preData;
}
