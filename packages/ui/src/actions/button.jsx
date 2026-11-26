import {Button as ButtonPrimitive} from "@base-ui/react/button";
import {cva} from "class-variance-authority";

import {cn} from "@site/ui/lib/utils";

/**
 * Кнопка дизайн-системы: 2 палитры × 6 вариантов × 8 размеров.
 *
 * scope   — палитра: "client" (тёплые токены forest/clay/cream, Apple-стиль) | "admin" (slate)
 * variant — роль: default | outline | secondary | ghost | destructive | link
 * size    — только геометрия: высота, паддинги, радиус, кегль, размер иконок
 *
 * Раскраска (цвет, тени, motion) живёт в compoundVariants (scope × variant),
 * поэтому размер и стиль не конфликтуют: размер задаёт форму, вариант — всё остальное.
 *
 * АНИМАЦИИ. Подъём на hover, пружинное сжатие на нажатие, пробегающий блик у CTA.
 * Всё под motion-safe: если анимаций «нет» — проверьте «Уменьшение движения»
 * в настройках ОС; это не баг, а доступность. В Tailwind v4 translate и scale —
 * отдельные css-свойства, поэтому они перечислены в transition-property
 * (подробнее — в комментарии к базовым классам).
 *
 * DISABLED. Base UI ставит data-disabled во всех случаях, а нативный атрибут disabled —
 * только у настоящей <button> и только без focusableWhenDisabled. Поэтому disabled-стили
 * завязаны на data-disabled (плюс disabled: для нативных), а интерактив гасится через
 * not-data-disabled: — так кнопка не «оживает» под курсором даже в режиме
 * focusableWhenDisabled (loading) и при nativeButton={false}.
 *
 * @example
 * <Button>Оформить заказ</Button>
 * <Button scope="admin" variant="outline" size="sm">Экспорт</Button>
 * <Button variant="destructive" size="icon-sm" aria-label="Удалить"><Trash2/></Button>
 * <Button disabled={loading} focusableWhenDisabled>Сохраняем…</Button>
 */
const buttonVariants = cva(
    [
        /* ── каркас ───────────────────────────────────────────────── */
        "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center",
        "whitespace-nowrap border border-transparent bg-clip-padding",
        "font-sans text-sm font-medium [-0.01em]",

        /* ── движение ─────────────────────────────────────────────────
              ВАЖНО (Tailwind v4): translate и scale — это ОТДЕЛЬНЫЕ css-свойства
              (translate:, scale:), а не transform. Всё, чего нет в transition-property,
              анимироваться не будет — сработает рывком. Поэтому translate и scale
              перечислены явно; transform оставлен для совместимости с v3, где
              подъём и сжатие были частью transform.
              Отпускание — с легким пружинным перелётом, нажатие — резче (ease-out).
              motion-safe — чтобы при prefers-reduced-motion ничего не дёргалось,
              not-data-disabled — чтобы disabled-кнопка не реагировала на курсор. ── */
        "transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "motion-safe:not-data-disabled:hover:-translate-y-px",
        "motion-safe:not-data-disabled:active:translate-y-0 motion-safe:not-data-disabled:active:scale-[0.97]",
        "motion-safe:not-data-disabled:active:duration-100 motion-safe:not-data-disabled:active:ease-out",

        /* ── состояния ────────────────────────────────────────────── */
        "outline-none focus-visible:ring-[3px]",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40 data-disabled:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",

        /* ── иконки внутри ────────────────────────────────────────── */
        "select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
    ].join(" "),
    {
        variants: {
            /* палитра — вся раскраска в compoundVariants */
            scope: {
                client: "",
                admin: "",
            },

            /* роль — вся раскраска в compoundVariants */
            variant: {
                default: "",
                outline: "",
                secondary: "",
                ghost: "",
                destructive: "",
                link: "",
            },

            /* только геометрия: цвет и тени сюда не пишем */
            size: {
                default: "h-11 gap-2 rounded-2xl px-5",
                xs: "h-7 gap-1 rounded-full px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
                sm: "h-9 gap-1.5 rounded-full px-3.5 text-[13px] [&_svg:not([class*='size-'])]:size-3.5",
                lg: "h-12 gap-2.5 rounded-2xl px-6 text-[15px]",
                icon: "size-11 rounded-2xl",
                "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-9 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
                "icon-lg": "size-12 rounded-2xl",
            },
        },

        compoundVariants: [
            /* ─────────────── CLIENT · тёплая палитра ─────────────── */
            {
                scope: "client",
                variant: "default",
                className: [
                    /* крупная CTA-пилюля: своя геометрия (h-auto вместо h-11 + py-4),
                       правый паддинг тесный (pr-3) — под хвостовой бейдж/иконку */
                    "group h-auto gap-3 rounded-full p-4",
                    "border-transparent bg-forest text-sm font-semibold uppercase [0.12em] text-cream",
                    /* объём: внутренний блик сверху + мягкая глубокая тень */
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(0,0,0,0.10),0_14px_30px_-16px_rgba(0,0,0,0.55)]",
                    /* пробегающий блик: ::after — узкая световая полоса, уезжает от края к краю.
                       overflow-hidden её подрезает, motion-safe — чтобы не мельтешило у тех,
                       кто просил уменьшить движение */
                    "overflow-hidden",
                    "after:pointer-events-none after:absolute after:inset-0",
                    "after:bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%)]",
                    "after:translate-x-[-120%] after:transition-transform after:duration-700 after:ease-out",
                    "motion-safe:hover:not-data-disabled:after:translate-x-[120%]",
                    "hover:not-data-disabled:bg-clay",
                    "hover:not-data-disabled:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_6px_rgba(0,0,0,0.12),0_20px_40px_-18px_rgba(0,0,0,0.6)]",
                    "active:not-data-disabled:bg-clay",
                    "active:not-data-disabled:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]",
                    "focus-visible:ring-forest/30",
                ].join(" "),
            },
            {
                scope: "client",
                variant: "outline",
                className: [
                    /* «стекло» в стиле iOS */
                    "border-black/[0.10] bg-white/75 text-[#007AFF] backdrop-blur-xl backdrop-saturate-150",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.05),0_10px_24px_-16px_rgba(0,0,0,0.35)]",
                    "hover:not-data-disabled:border-black/[0.14] hover:not-data-disabled:bg-white",
                    "active:not-data-disabled:bg-black/5 active:not-data-disabled:shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]",
                    "focus-visible:ring-[#007AFF]/30",
                    "dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-[#0A84FF]",
                    "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.4)]",
                    "dark:hover:not-data-disabled:border-white/[0.18] dark:hover:not-data-disabled:bg-white/[0.12]",
                    "dark:active:not-data-disabled:bg-white/[0.16]",
                    "dark:focus-visible:ring-[#0A84FF]/[0.35]",
                ].join(" "),
            },
            {
                scope: "client",
                variant: "secondary",
                className: [
                    "border-transparent bg-[#F2F2F7] text-[#1C1C1E]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)]",
                    "hover:not-data-disabled:bg-[#E8E8ED]",
                    "hover:not-data-disabled:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_-4px_rgba(0,0,0,0.18)]",
                    "active:not-data-disabled:bg-[#DCDCE2] active:not-data-disabled:shadow-none",
                    "focus-visible:ring-[#007AFF]/30",
                    "dark:bg-[#2C2C2E] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                    "dark:hover:not-data-disabled:bg-[#3A3A3C]",
                    "dark:active:not-data-disabled:bg-[#48484A]",
                    "dark:focus-visible:ring-[#0A84FF]/[0.35]",
                ].join(" "),
            },
            {
                scope: "client",
                variant: "ghost",
                className: [
                    "border-transparent bg-transparent text-[#007AFF]",
                    "hover:not-data-disabled:bg-[#007AFF]/10 active:not-data-disabled:bg-[#007AFF]/[0.18]",
                    "focus-visible:ring-[#007AFF]/30",
                    "dark:text-[#0A84FF]",
                    "dark:hover:not-data-disabled:bg-[#0A84FF]/[0.12] dark:active:not-data-disabled:bg-[#0A84FF]/20",
                    "dark:focus-visible:ring-[#0A84FF]/[0.35]",
                ].join(" "),
            },
            {
                scope: "client",
                variant: "destructive",
                className: [
                    "border-transparent bg-[#FF3B30]/[0.12] text-[#FF3B30]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
                    "hover:not-data-disabled:bg-[#FF3B30]/20 hover:not-data-disabled:shadow-[0_4px_14px_-8px_rgba(255,59,48,0.6)]",
                    "active:not-data-disabled:bg-[#FF3B30]/[0.28] active:not-data-disabled:shadow-none",
                    "focus-visible:ring-[#FF3B30]/30",
                    "dark:bg-[#FF453A]/[0.15] dark:text-[#FF453A] dark:shadow-none",
                    "dark:hover:not-data-disabled:bg-[#FF453A]/25 dark:active:not-data-disabled:bg-[#FF453A]/[0.35]",
                    "dark:focus-visible:ring-[#FF453A]/[0.35]",
                ].join(" "),
            },
            {
                scope: "client",
                variant: "link",
                className: [
                    /* ссылка — это текст, а не поверхность: без подъёма и без сжатия.
                       Цепочки вариантов — зеркало базовых, чтобы twMerge вырезал их
                       и не пришлось разбираться, кто из CSS-правил победит */
                    "h-auto rounded-md border-transparent bg-transparent p-0 text-[#007AFF] underline-offset-4",
                    "motion-safe:not-data-disabled:hover:translate-y-0",
                    "motion-safe:not-data-disabled:active:scale-100",
                    "hover:not-data-disabled:underline hover:not-data-disabled:decoration-[1.5px]",
                    "focus-visible:ring-[#007AFF]/30",
                    "dark:text-[#0A84FF] dark:focus-visible:ring-[#0A84FF]/[0.35]",
                ].join(" "),
            },

            /* ─────────────── ADMIN · slate-палитра ──────────────── */
            {
                scope: "admin",
                variant: "default",
                className: [
                    "border-transparent bg-slate-900 text-white",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(15,23,42,0.2),0_10px_24px_-16px_rgba(15,23,42,0.7)]",
                    "hover:not-data-disabled:bg-slate-800",
                    "hover:not-data-disabled:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_6px_rgba(15,23,42,0.22)]",
                    "active:not-data-disabled:bg-slate-950 active:not-data-disabled:shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]",
                    "focus-visible:ring-slate-900/25",
                    "dark:bg-slate-100 dark:text-slate-900 dark:shadow-none",
                    "dark:hover:not-data-disabled:bg-white dark:active:not-data-disabled:bg-slate-300",
                    "dark:focus-visible:ring-slate-400/40",
                ].join(" "),
            },
            {
                scope: "admin",
                variant: "outline",
                className: [
                    "border-slate-300 bg-white text-slate-900",
                    "shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
                    "hover:not-data-disabled:border-slate-400 hover:not-data-disabled:bg-slate-50",
                    "active:not-data-disabled:bg-slate-100 active:not-data-disabled:shadow-none",
                    "focus-visible:ring-slate-500/30",
                    "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-none",
                    "dark:hover:not-data-disabled:border-slate-600 dark:hover:not-data-disabled:bg-slate-900",
                    "dark:active:not-data-disabled:bg-slate-800",
                    "dark:focus-visible:ring-slate-400/[0.35]",
                ].join(" "),
            },
            {
                scope: "admin",
                variant: "secondary",
                className: [
                    "border-transparent bg-slate-100 text-slate-900",
                    "hover:not-data-disabled:bg-slate-200 active:not-data-disabled:bg-slate-300",
                    "focus-visible:ring-slate-500/30",
                    "dark:bg-slate-800 dark:text-slate-100",
                    "dark:hover:not-data-disabled:bg-slate-700 dark:active:not-data-disabled:bg-slate-600",
                    "dark:focus-visible:ring-slate-400/[0.35]",
                ].join(" "),
            },
            {
                scope: "admin",
                variant: "ghost",
                className: [
                    "border-transparent bg-transparent text-slate-700",
                    "hover:not-data-disabled:bg-slate-100 hover:not-data-disabled:text-slate-950",
                    "active:not-data-disabled:bg-slate-200",
                    "focus-visible:ring-slate-500/30",
                    "dark:text-slate-300",
                    "dark:hover:not-data-disabled:bg-slate-800 dark:hover:not-data-disabled:text-white",
                    "dark:active:not-data-disabled:bg-slate-700",
                    "dark:focus-visible:ring-slate-400/[0.35]",
                ].join(" "),
            },
            {
                scope: "admin",
                variant: "destructive",
                className: [
                    "border-transparent bg-red-100 text-red-700",
                    "hover:not-data-disabled:bg-red-200 active:not-data-disabled:bg-red-300",
                    "focus-visible:ring-red-500/30",
                    "dark:bg-red-950/40 dark:text-red-300",
                    "dark:hover:not-data-disabled:bg-red-950/60 dark:active:not-data-disabled:bg-red-950/80",
                    "dark:focus-visible:ring-red-400/[0.35]",
                ].join(" "),
            },
            {
                scope: "admin",
                variant: "link",
                className: [
                    "h-auto rounded-md border-transparent bg-transparent p-0 text-slate-700 underline-offset-4",
                    "motion-safe:not-data-disabled:hover:translate-y-0",
                    "motion-safe:not-data-disabled:active:scale-100",
                    "hover:not-data-disabled:text-slate-950 hover:not-data-disabled:underline",
                    "focus-visible:ring-slate-500/30",
                    "dark:text-slate-300 dark:hover:not-data-disabled:text-white",
                    "dark:focus-visible:ring-slate-400/[0.35]",
                ].join(" "),
            },
        ],

        defaultVariants: {
            scope: "client",
            variant: "default",
            size: "default",
        },
    }
);

function Button({className, scope = "client", variant = "default", size = "default", ...props}) {
    return (
        <ButtonPrimitive
            data-slot="button"
            data-scope={scope}
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({scope, variant, size}), className)}
            {...props}
        />
    );
}

export {Button, buttonVariants};
