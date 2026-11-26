import {createElement, type ComponentType, type ReactNode} from "react";
import {PackageSearch} from "lucide-react";

export interface EmptyStateProps {
    icon?: ComponentType<{className?: string; "aria-hidden"?: boolean}>;
    title: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}

export function EmptyState({
                               icon: Icon = PackageSearch,
                               title,
                               description = "",
                               children = null,
                               className = "",
                           }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}>
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-[#2C2C2E] dark:text-[#AEAEB2]">
                {createElement(Icon, {className: "h-6 w-6", "aria-hidden": true})}
            </span>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{title}</h2>
            {description && <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-[#98989D]">{description}</p>}
            {children}
        </div>
    );
}
