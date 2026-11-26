import Link from "next/link";
import { Clock, Leaf, Mail, MapPin, Phone } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "ВКонтакте",
    short: "VK",
    href: "https://vk.ru/zelenyeusy",
  },
  {
    label: "Одноклассники",
    short: "OK",
    href: "https://ok.ru/group/70000047394956",
  },
  {
    label: "Max",
    short: "MAX",
    href: "https://max.ru/join/xbhfJoXaB_WVpdDdiQ4ZJCX12sLDNXOOFRLi2S9Colg",
  },
];

const CATALOG_LINKS = [
  { label: "Все растения", href: "/products" },
  { label: "Хиты продаж", href: "/products?sort=sales" },
  { label: "Новинки", href: "/products?sort=new" },
];

const CUSTOMER_LINKS = [
  { label: "О магазине", href: "/about" },
  { label: "Доставка и оплата", href: "/#faq" },
  { label: "Частые вопросы", href: "/#faq" },
  { label: "Корзина", href: "/cart" },
  { label: "Контакты", href: "/contact" },
];

export function Footer() {
  return (
    <footer
      id="contacts"
      className="mt-auto w-full scroll-mt-24 bg-forest text-cream"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-14 pt-16 md:grid-cols-12 md:px-10 md:pt-20">
        <div className="md:col-span-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-cream text-forest">
              <Leaf className="size-5" strokeWidth={1.8} />
            </span>
            <span className="font-display text-[26px] font-semibold leading-none tracking-tight">
              Зеленые усы
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/65">
            Цветочная лавка комнатных и садовых растений. Семейное дело с 2005
            года — бережно выращиваем и остаёмся на связи после покупки.
          </p>
          <div className="mt-7 flex gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.short}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-11 min-w-11 place-items-center rounded-full border border-cream/20 px-3 text-[11px] font-bold tracking-[0.12em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:border-clay hover:bg-clay"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">
            Каталог
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            {CATALOG_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">
            Покупателям
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            {CUSTOMER_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">
            Контакты
          </h4>
          <ul className="mt-5 space-y-4 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-clay"
                strokeWidth={1.8}
              />
              <span>
                Брянская обл., г. Новозыбков — самовывоз · Почта России и СДЭК
                по всей России
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock
                className="mt-0.5 size-4 shrink-0 text-clay"
                strokeWidth={1.8}
              />
              <span>Пн–Вс 10:00–20:00 · заказы на сайте круглосуточно</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone
                className="mt-0.5 size-4 shrink-0 text-clay"
                strokeWidth={1.8}
              />
              <a
                href="tel:+79192926324"
                className="transition-colors hover:text-cream"
              >
                +7 (919) 292-63-24
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail
                className="mt-0.5 size-4 shrink-0 text-clay"
                strokeWidth={1.8}
              />
              <a
                href="mailto:info@zelenyeusy.ru"
                className="transition-colors hover:text-cream"
              >
                info@zelenyeusy.ru
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px] text-cream/50 md:px-10">
          <p>© 2026 Цветочная лавка «Зеленые усы»</p>
          <p>г. Новозыбков · Почта России и СДЭК</p>
        </div>
      </div>
    </footer>
  );
}
