/** Resolve static assets under Vite base path or pass through absolute URLs. */
export function assetUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }
  const base = import.meta.env.BASE_URL
  return `${base}${src.replace(/^\//, "")}`
}
