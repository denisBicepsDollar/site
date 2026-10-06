import {twMerge} from "tailwind-merge";

const variants = {
    default: "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
    accent: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    ghost: "border-transparent bg-transparent text-zinc-600 hover:bg-zinc-100",
};

/** A small, consistent button primitive shared by dashboard feature pages. */
export function Button({
                           children,
                           text,
                           variant = "default",
                           className = "",
                           type = "button",
                           disabled = false,
                           ...buttonProps
                       }) {
    return (
        <button
            {...buttonProps}
            type={type}
            disabled={disabled}
            className={twMerge(
                "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant] ?? variants.default,
                className,
            )}
        >
            {children}
            {text && <span>{text}</span>}
        </button>
    );
}