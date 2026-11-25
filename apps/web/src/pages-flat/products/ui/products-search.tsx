"use client";
import { Button } from "@/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ProductsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const lastPushedRef = useRef(urlQuery);

  useEffect(() => {
    if (urlQuery !== lastPushedRef.current) {
      lastPushedRef.current = urlQuery;
      setValue(urlQuery);
    }
  }, [urlQuery]);

  const applySearchToUrl = (rawText: string) => {
    const trimmed = rawText.trim();

    if (trimmed === urlQuery) return;

    lastPushedRef.current = trimmed;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applySearchToUrl(value);
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  const handleClear = () => {
    setValue("");
    applySearchToUrl("");
  };

  return (
    <InputGroup className="max" insetEnd>
      <InputGroupInput
        aria-label="Найти товар"
        value={value}
        onValueChange={setValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            applySearchToUrl(value);
          }
        }}
        placeholder="Найти товар"
        type="search"
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>

      {value && (
        <InputGroupAddon align="inline-end">
          <Button
            onClick={handleClear}
            aria-label="Очистить поиск"
            profile="field-action"
            shape="square"
          >
            <X />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
