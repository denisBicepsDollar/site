"use client";

import { SidebarInsetContent } from "./sidebar-inset-content";
import { useProductsCatalog } from "../model/useProductsStore";

export default function ProductsScreen({ initialData }: { initialData: any }) {
  console.log("data", initialData);
  useProductsCatalog(initialData);

  return <SidebarInsetContent className="m-0" />;
}
