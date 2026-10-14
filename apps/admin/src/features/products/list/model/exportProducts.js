const csvCell = value => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function downloadProductsCsv(products) {
    const headers = [
        "ID",
        "Название",
        "Артикул",
        "Категория",
        "Цена",
        "Остаток",
        "Варианты",
        "Статус",
        "Обновлён",
    ];
    const rows = products.map(product => [
        product.id,
        product.name,
        product.sku,
        product.category,
        product.price,
        product.stock,
        product.variantSummary,
        product.status,
        product.updated,
    ]);
    const contents = [headers, ...rows]
        .map(row => row.map(csvCell).join(";"))
        .join("\r\n");
    const file = new Blob([`\uFEFF${contents}`], {type: "text/csv;charset=utf-8"});
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "catalog.csv";
    link.click();
    URL.revokeObjectURL(url);
}