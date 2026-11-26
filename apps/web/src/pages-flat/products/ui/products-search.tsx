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
  const lastPushedRef = useRef(urlQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestRef = useRef({ pathname, searchParams, urlQuery });
  latestRef.current = { pathname, searchParams, urlQuery };

  useEffect(() => {
    if (urlQuery !== lastPushedRef.current) {
      lastPushedRef.current = urlQuery;
      setValue(urlQuery);
    }
  }, [urlQuery]);

  const applySearchToUrl = useCallback(
    (rawText: string) => {
      const {
        pathname: currentPathname,
        searchParams: currentSearchParams,
        urlQuery: currentUrlQuery,
      } = latestRef.current;

      const trimmed = rawText.trim();
      if (trimmed === currentUrlQuery) return;

      lastPushedRef.current = trimmed;
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

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      applySearchToUrl(value);
    }, 400);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, applySearchToUrl]);

  const handleClear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setValue("");
    applySearchToUrl("");
  };

  return (
    <InputGroup className="w-full" insetEnd>
      <InputGroupInput
        aria-label="Найти товар"
        value={value}
        onValueChange={setValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
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
