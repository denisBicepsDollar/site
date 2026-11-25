import { usePathname } from "next/navigation";
const TITLES: Record<string, string> = {
  "/products": "Все товары",
  "/products/indoor": "Комнатные растения",
  "/products/outdoor": "Садовые растения",
};
export function ProductsHeader() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Все товары";
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Посмотрите нашу коллекцию товаров
      </p>
    </>
  );
}
