'use client'

import {useState, FormEvent} from 'react';
import {
    ArrowRight,
    AtSign,
    Check,
    Clock,
    Leaf,
    Mail,
    MapPin,
    Phone,
    Play,
    Send,
} from 'lucide-react';
import {Eyebrow, Reveal} from '../../reveal/reveal';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!email.includes('@')) return;
        setDone(true);
    };

    return (
        <div className="mx-auto -mb-2 max-w-[1400px] px-5 md:px-10">
            <Reveal>
                <div className="overflow-hidden rounded-[32px] bg-pine">
                    <div className="grid lg:grid-cols-2">
                        <div className="p-9 md:p-14">
                            <Eyebrow light>Зелёная рассылка</Eyebrow>
                            <h3 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-cream md:text-5xl">
                                Советы по уходу —{' '}
                                <em className="font-light italic text-sage">раз в неделю</em>
                            </h3>
                            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/60">
                                Без спама: только сезонные подборки, лайфхаки ботаников и скидки
                                до 20% для подписчиков.
                            </p>
                            {done ? (
                                <div
                                    className="mt-8 flex items-center gap-3 rounded-2xl border border-sage/30 bg-sage/10 px-5 py-4 text-cream">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage text-forest">
                    <Check className="size-5" strokeWidth={2.2}/>
                  </span>
                                    <p className="text-sm font-medium">
                                        Готово! Первое письмо уже летит на {email}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="mt-8 flex max-w-md gap-2">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ваша@почта.ru"
                                        className="w-full rounded-full border border-cream/20 bg-cream/10 px-6 py-4 text-sm text-cream placeholder:text-cream/40 focus:border-sage focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="group flex shrink-0 items-center gap-2 rounded-full bg-clay px-6 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-cream hover:text-forest"
                                    >
                                        Далее
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/>
                                    </button>
                                </form>
                            )}
                            <p className="mt-4 text-[11px] text-cream/35">
                                Нажимая «Далее», вы соглашаетесь с политикой конфиденциальности
                            </p>
                        </div>
                        <div className="relative min-h-[280px]">
                            <img
                                src="https://images.pexels.com/photos/33208508/pexels-photo-33208508.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                alt="Лавандовая гортензия в цвету"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-pine via-pine/20 to-transparent max-lg:bg-gradient-to-t"/>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
}

export function Footer() {
    return (
        <footer id="contacts" className="scroll-mt-24 bg-cream pb-0 pt-24 md:pt-32">
            <Newsletter/>

            <div className="mt-16 bg-forest text-cream">
                <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-16 pt-20 md:grid-cols-12 md:px-10">
                    <div className="md:col-span-4">
                        <a href="#top" className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-full bg-cream text-forest">
                <Leaf className="size-5" strokeWidth={1.8}/>
              </span>
                            <span className="font-display text-[26px] font-semibold leading-none">
                Ботаника
              </span>
                        </a>
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">
                            Магазин комнатных и садовых растений. Выращиваем сами, доставляем
                            бережно и остаёмся на связи после покупки.
                        </p>
                        <div className="mt-7 flex gap-3">
                            {[
                                {icon: AtSign, label: 'Инстаграм'},
                                {icon: Send, label: 'Телеграм'},
                                {icon: Play, label: 'Видеоблог'},
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href="#top"
                                    aria-label={s.label}
                                    className="grid size-11 place-items-center rounded-full border border-cream/20 transition-all duration-300 hover:-translate-y-1 hover:bg-clay hover:border-clay"
                                >
                                    <s.icon className="size-[18px]" strokeWidth={1.7}/>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">Каталог</h4>
                        <ul className="mt-5 space-y-3 text-sm text-cream/60">
                            {['Комнатные', 'Садовые', 'Кашпо и грунт', 'Подарочные карты', 'Под заказ'].map((l) => (
                                <li key={l}>
                                    <a href="#catalog" className="transition-colors hover:text-cream">
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">Покупателям</h4>
                        <ul className="mt-5 space-y-3 text-sm text-cream/60">
                            {['Доставка и оплата', 'Гарантия 30 дней', 'Уход за растениями', 'Вопросы и ответы', 'Консультация ботаника'].map((l) => (
                                <li key={l}>
                                    <a href="#care" className="transition-colors hover:text-cream">
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">Контакты</h4>
                        <ul className="mt-5 space-y-4 text-sm text-cream/60">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.8}/>
                                Москва, ул. Лесная, 12 — магазин и оранжерея
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.8}/>
                                Ежедневно 10:00–21:00
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.8}/>
                                <a href="tel:+74951204567" className="transition-colors hover:text-cream">
                                    +7 (495) 120-45-67
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.8}/>
                                <a href="mailto:hello@botanika.shop" className="transition-colors hover:text-cream">
                                    hello@botanika.shop
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <p
                        aria-hidden
                        className="select-none whitespace-nowrap text-center font-display text-[17vw] font-semibold leading-[0.8] text-outline-cream"
                    >
                        ботаника
                    </p>
                </div>

                <div className="border-t border-cream/10">
                    <div
                        className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px] text-cream/35 md:px-10">
                        <p>© 2026 «Ботаника». Сделано с любовью к зелени</p>
                        <p>Фотографии растений — Pexels</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
