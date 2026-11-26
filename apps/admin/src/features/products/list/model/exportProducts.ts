import {statusLabels} from "@/shared/components/localization.ts";

const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function downloadProductsCsv(products: Array<Record<string, any>>) {
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
    const rows = products.map(product => {
        const variantSummary = product.variantSummary ?? (product.variants ?? [])
            .map((v: {name?: string; stock?: number; price?: number}) =>
                `${v.name || "Стандарт"}: ${v.stock ?? 0} шт. (${v.price ?? product.price ?? 0} ₽)`)
            .join(", ");

        return [
            product.id,
            product.name,
            product.sku,
            product.category,
            product.price,
            product.stock,
            variantSummary,
            statusLabels[product.status] ?? product.status,
            product.updated,
        ];
    });
    const contents = [headers, ...rows]
        .map(row => row.map(csvCell).join(";"))
        .join("\r\n");
    const file = new Blob([`\uFEFF${contents}`], {type: "text/csv;charset=utf-8"});
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "catalog.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
