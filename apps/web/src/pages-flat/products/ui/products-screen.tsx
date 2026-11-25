"use client";

import { SidebarInsetContent } from "./sidebar-inset-content";
import { useProductsStore } from "../model/useProductsStore";

export default function ProductsScreen({ data }) {
  const setProductsData = useProductsStore((state) => state.setProductsData);
  console.log("data", data);
  setProductsData(data);

  return <SidebarInsetContent className="m-0" />;
}
