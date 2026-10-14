export function getUniqueStatuses(data) {
    const statusInfo = data.reduce((acc, row) => {
        if (row.status) acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
    }, {});

    // Считаем общее количество, сложив все значения объекта
    const totalCount = Object.values(statusInfo).reduce((sum, count) => sum + count, 0);

    // Сразу возвращаем массив для табов, убрав лишнюю переменную
    return [
        {label: 'all', count: totalCount},
        ...Object.entries(statusInfo).map(([label, count]) => ({label, count}))
    ];
}
