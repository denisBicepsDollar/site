/* ============================================================================
   SNAPSHOT — слепок формы для проверки «есть ли несохранённые изменения».

   Слепок намеренно «нормализует» значения (числа, пустые строки), чтобы
   "4800" и 4800 считались одним и тем же и кнопка «Сохранить» не горела зря.
   ============================================================================ */

const toNumberOrEmpty = value => (value === "" || value === null || value === undefined ? "" : Number(value));

export function buildSnapshot(state) {
    return JSON.stringify({
        name: state.name,
        description: state.description,
        status: state.status,
        category: state.category,
        basePrice: toNumberOrEmpty(state.basePrice),
        note: state.note,
        cover: state.cover,
        variants: state.variants.map(variant => ({
            name: variant.name,
            stock: Number(variant.stock),
            price: toNumberOrEmpty(variant.price),
            previewImage: variant.previewImage ?? "",
            images: [...variant.images],
        })),
    });
}