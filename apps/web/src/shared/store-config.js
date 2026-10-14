"use client";

import {createContext, useContext} from "react";
import {CURRENCY, LOCALE} from "@/shared/lib/constants";
import {TaxBehavior} from "@/shared/lib/pricing";

// `language` is the storefront's default language as the platform spells it (e.g. "pl-PL"), or null
// for a store that never set one; `locale` is what prices and dates format in.

// Fallback constants only apply when a component renders outside the provider (tests, isolated previews).
const StoreConfigContext = createContext({
    currency: CURRENCY,
    locale: LOCALE,
    language: null,
    taxBehavior: "inclusive",
});

export function StoreConfigProvider({value, children}) {
    return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
}

export function useStoreConfig() {
    return useContext(StoreConfigContext);
}