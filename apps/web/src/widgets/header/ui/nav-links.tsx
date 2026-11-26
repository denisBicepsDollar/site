"use client";

import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {nav} from '../config/const';

export function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => {
                const active = pathname === n.to;
                return (
                    <Link
                        key={n.to}
                        href={n.to}
                        className={`group relative text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-forest ${
                            active ? 'text-forest' : 'text-ink/70'
                        }`}
                    >
                        {n.label}
                        <span
                            className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-clay transition-transform duration-300 ${
                                active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}
