"use client";
import { Button } from "@/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function ProductsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestRef = useRef({ pathname, searchParams, urlQuery });
  latestRef.current = { pathname, searchParams, urlQuery };

  const clearPendingTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearPendingTimer();
    setValue(urlQuery);
  }, [urlQuery, pathname, clearPendingTimer]);

  useEffect(() => clearPendingTimer, [clearPendingTimer]);

  const applySearchToUrl = useCallback(
    (rawText: string) => {
      const {
        pathname: currentPathname,
        searchParams: currentSearchParams,
        urlQuery: currentUrlQuery,
      } = latestRef.current;

      const trimmed = rawText.trim();
      if (trimmed === currentUrlQuery.trim()) return;

      const params = new URLSearchParams(currentSearchParams.toString());
      params.delete("page");

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const query = params.toString();
      router.push(`${currentPathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
    clearPendingTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      applySearchToUrl(nextValue);
    }, 400);
  };

  const handleClear = () => {
    clearPendingTimer();
    setValue("");
    applySearchToUrl("");
  };

  return (
    <InputGroup className="w-full" insetEnd>
      <InputGroupInput
        aria-label="Найти товар"
        value={value}
        onValueChange={handleValueChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            clearPendingTimer();
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
