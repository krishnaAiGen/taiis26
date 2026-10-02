import type { ImgHTMLAttributes } from "react"
import { assetUrl } from "../utils/assetUrl"

type SiteImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
}

/** Conference images (local public/ or approved remote URLs). */
export function SiteImage({ src, alt = "", ...props }: SiteImageProps) {
  return (
    <img
      {...props}
      src={assetUrl(src)}
      alt={alt}
      referrerPolicy="no-referrer"
      decoding="async"
    />
  )
}
