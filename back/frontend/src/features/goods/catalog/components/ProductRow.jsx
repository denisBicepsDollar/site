import {Leaf} from "lucide-react";
import {Link} from "react-router-dom";
import {formatPrice, PRODUCT_STATUS_LABELS} from "../model/catalog.js";

const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    draft: "bg-amber-50 text-amber-700 ring-amber-600/15",
    archived: "bg-zinc-100 text-zinc-600 ring-zinc-500/10",
};

export function ProductRow({product, selected, onToggle}) {
    const stockLabel = product.stock === 0
        ? "Нет в наличии"
        : product.stock <= 5
            ? `${product.stock} шт. · мало`
            : `${product.stock} шт.`;

    return (
        <tr className={`border-t border-zinc-100 transition-colors hover:bg-zinc-50/80 ${selected ? "bg-blue-50/40" : "bg-white"}`}>
            <td className="w-12 px-4 py-3">
                <input
                    type="checkbox"
                    aria-label={`Выбрать товар «${product.name}»`}
                    checked={selected}
                    onChange={() => onToggle(product.id)}
                    className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
            </td>
            <td className="min-w-[18rem] px-3 py-3">
                <Link to={`/dashboard/goods/${product.id}`}
                      className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-900/5">
                        <Leaf className="h-5 w-5" aria-hidden="true"/>
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-700">
                            {product.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">{product.sku}</span>
                    </span>
                </Link>
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-sm text-zinc-600">{product.category}</td>
            <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-medium tabular-nums text-zinc-900">
                {formatPrice(product.price)}
            </td>
            <td className={`whitespace-nowrap px-3 py-3 text-right text-sm tabular-nums ${product.stock <= 5 ? "font-medium text-rose-700" : "text-zinc-700"}`}>
                {stockLabel}
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-sm text-zinc-600">{product.variantSummary || "—"}</td>
            <td className="whitespace-nowrap px-3 py-3">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[product.status] ?? statusStyles.archived}`}>
                    {PRODUCT_STATUS_LABELS[product.status] ?? "Неизвестен"}
                </span>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">{product.updated}</td>
        </tr>
    );
}