"use client";

import { useEffect, useRef } from "react";

interface RussianPostAddressData {
  indexTo?: string;
  regionTo?: string;
  areaTo?: string;
  cityTo?: string;
  addressTo?: string;
  pvzType?: string;
  cashOfDelivery?: number;
  sumoc?: number;
  [key: string]: unknown;
}

interface RussianPostProps {
  onSelectAddress?: (data: RussianPostAddressData) => void;
}

declare global {
  interface Window {
    callbackAddress?: (data: RussianPostAddressData) => void;
    ecomStartWidget?: (config: {
      id: string;
      callbackFunction: (data: RussianPostAddressData) => void;
      containerId: string;
    }) => void;
  }
}

export function RussianPost({ onSelectAddress }: RussianPostProps) {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onSelectAddress);
  callbackRef.current = onSelectAddress;

  useEffect(() => {
    const widgetId = process.env.NEXT_PUBLIC_POCHTA_WIDGET_ID ?? "";
    if (!widgetId) {
      // Widget requires registered pochta.ru widget ID; fallback stays manual address input above
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.pochta.ru/map/widget/widget.js";
    script.async = true;

    script.onload = () => {
      window.callbackAddress = (data) => {
        if (callbackRef.current) callbackRef.current(data);
      };

      if (window.ecomStartWidget && widgetRef.current) {
        window.ecomStartWidget({
          id: widgetId,
          callbackFunction: window.callbackAddress,
          containerId: "ecom-widget",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.callbackAddress;
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_POCHTA_WIDGET_ID) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        Укажите адрес или номер отделения Почты России в поле адреса выше — мы
        уточним стоимость и сроки после подтверждения.
      </p>
    );
  }

  return <div id="ecom-widget" ref={widgetRef} style={{ height: 500 }} />;
}
