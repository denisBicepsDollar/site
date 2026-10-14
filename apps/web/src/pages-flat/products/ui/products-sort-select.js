"use client";

import Link from "next/link";
import {ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui/select";
import {cn} from "@/shared/lib/utils";


export function SortLinks({options}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const defaultValue = options[0]?.value;
    const current = searchParams.get("sort") ?? defaultValue;

    return (
        <>
            {options.map((option) => {
                const isActive = option.value === current;
                return (
                    <Link
                        key={option.value}
                        href='dasdasd'
                        className={cn(
                            "text-sm transition-colors",
                            isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {option.label}
                    </Link>
                );
            })}
        </>
    );
}

/** Compact sort dropdown for small screens. Reads the current sort from the URL (client-side). */
export function SortSelect({options, className}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const defaultValue = options[0]?.value;
    const current = searchParams.get("sort") ?? defaultValue;

    const onChange = (value) => {
        router.push(buildSortHref(searchParams, pathname, value, defaultValue), {scroll: false});
    };

    return (
        <Select value={current} onValueChange={onChange}>
            <SelectTrigger size="sm" className={cn("w-auto min-w-[9rem]", className)} aria-label="Sort products">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent align="end">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}