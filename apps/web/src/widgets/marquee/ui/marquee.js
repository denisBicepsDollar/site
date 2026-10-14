import {Sprout} from 'lucide-react';

const words = [
    'Монстера',
    'Гортензия',
    'Фикус',
    'Пион',
    'Орхидея',
    'Филодендрон',
    'Лаванда',
    'Алоказия',
];

export function Marquee() {
    const row = [...words, ...words];
    return (
        <div className="relative z-10 overflow-hidden border-y border-cream/10 bg-forest py-5">
            <div className="flex w-max animate-marquee items-center gap-10 pr-10">
                {[0, 1].map((half) => (
                    <div key={half} className="flex items-center gap-10" aria-hidden={half === 1}>
                        {row.map((w, i) => (
                            <span key={`${half}-${i}`} className="flex items-center gap-10">
                <span
                    className={`whitespace-nowrap font-display text-4xl font-medium italic md:text-[52px] ${
                        i % 2 === 0 ? 'text-cream' : 'text-outline-cream'
                    }`}
                >
                  {w}
                </span>
                <Sprout className="size-6 shrink-0 text-sage/70" strokeWidth={1.5}/>
              </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
