"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/shared/ui/combobox";
import { SelectButton } from "@/shared/ui/select";

const SORTING_TAGS = [
  { label: "Популярные", value: "score" },
  { label: "Новинки", value: "new" },
  { label: "Дешевле", value: "price" },
  { label: "Дороже", value: "price_desc" },
] as const;

type SortOption = (typeof SORTING_TAGS)[number];

export function ProductsSortCombobox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Находим текущий объект опции по значению из URL (по умолчанию "score")
  const currentSortValue = searchParams.get("sort") ?? "score";
  const currentOption =
    SORTING_TAGS.find((tag) => tag.value === currentSortValue) ??
    SORTING_TAGS[0];

  const handleSortChange = (selected: SortOption | null) => {
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());

    // Дефолтную сортировку ("score") не пишем в URL, чтобы ссылка была чистой
    if (selected.value === "score") {
      params.delete("sort");
    } else {
      params.set("sort", selected.value);
    }

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <Combobox
      value={currentOption}
      onValueChange={handleSortChange}
      items={SORTING_TAGS}
    >
      <ComboboxTrigger render={<SelectButton className="max-w-xs" />}>
        <ComboboxValue />
      </ComboboxTrigger>
      <ComboboxPopup aria-label="Сортировка товаров">
        <ComboboxList>
          {SORTING_TAGS.map((sortingTag) => (
            <ComboboxItem key={sortingTag.value} value={sortingTag}>
              {sortingTag.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
