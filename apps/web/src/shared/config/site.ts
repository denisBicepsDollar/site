export const SITE_NAME = "Зеленые усы";
export const DEFAULT_SITE_URL = "https://zelenyeusy.ru";
export const DEFAULT_OG_IMAGE = "/1.png";

export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}
