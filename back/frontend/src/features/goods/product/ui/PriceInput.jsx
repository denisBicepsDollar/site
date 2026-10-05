/* Поле цены с подписью и значком ₽.

   Используется дважды: «Базовая цена» в шапке товара и «Своя цена» в строке
   варианта — отличаются только размерами, которые передаются классами. */
export function PriceInput({
                               value,
                               onChange,
                               label,
                               required = false,
                               wrapperClassName = "",
                               inputClassName = "",
                           }) {
    return (
        <div className="flex items-center gap-2">
            {label && (
                <span className="text-zinc-400">
                    {label}
                    {required && <span className="ml-0.5 text-red-500"> *</span>}
                </span>
            )}

            <label className={`flex items-center rounded-lg border border-zinc-200 bg-white p-2
                               focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900
                               ${wrapperClassName}`}>
                <input
                    type="number"
                    min="0"
                    step="1"
                    className={`bg-transparent font-medium tabular-nums outline-none ${inputClassName}`}
                    placeholder="0"
                    value={value ?? ""}
                    onChange={event => onChange(event.target.value)}
                />
                <span className="text-zinc-400">₽</span>
            </label>
        </div>
    );
}