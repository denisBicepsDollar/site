import { Suspense } from "react";
import { getCachedHeroData } from "@/shared/api/server";
import { HeroView } from "./hero-view";

async function HeroContent() {
  const { product, totalCount } = await getCachedHeroData();
  return <HeroView featuredProduct={product} totalCount={totalCount} />;
}

export function Hero() {
  return (
    <Suspense
      fallback={
        <HeroView featuredProduct={null} totalCount={null} isPending />
      }
    >
      <HeroContent />
    </Suspense>
  );
}
