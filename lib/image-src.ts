import { FALLBACK_IMAGE } from "@/lib/constants"

/** Valid string for `next/image` `src` — treats null, undefined, non-string, and blank as fallback */
export function imageSrc(url: unknown): string {
  if (typeof url !== "string") return FALLBACK_IMAGE
  const t = url.trim()
  return t === "" ? FALLBACK_IMAGE : t
}
