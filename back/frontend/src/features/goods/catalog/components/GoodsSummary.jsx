import {createElement} from "react";
import {AlertTriangle, CheckCircle2, Package} from "lucide-react";

const metrics = [
    {key: "total", label: "Всего товаров", icon: Package, iconClass: "bg-blue-50 text-blue-700"},
    {key: "active", label: "Активные", icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-700"},
    {key: "lowStock", label: "Низкий остаток", icon: AlertTriangle, iconClass: "bg-amber-50 text-amber-700"},
];

export function GoodsSummary({summary}) {
    return (
        <section aria-label="Сводка по товарам" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map(({key, label, icon: Icon, iconClass}) => (
                <article key={key}
                         className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm shadow-zinc-950/[0.02]">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                        {createElement(Icon, {className: "h-5 w-5", "aria-hidden": true})}
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-500">{label}</p>
                        <p className="mt-0.5 text-xl font-semibold leading-none tabular-nums text-zinc-950">
                            {summary[key]}
                        </p>
                    </div>
                </article>
            ))}
        </section>
    );
}