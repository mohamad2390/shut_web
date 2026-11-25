import { showcaseMediaUrl } from "@/lib/api";
import type { ShowcaseItem } from "@/lib/types";

/** Photos, videos and files of one portfolio section. Everything is fetched lazily. */
export function ShowcaseGrid({ providerId, items }: { providerId: number; items: ShowcaseItem[] }) {
  return (
    <ul className="showcase">
      {items.map((item) => {
        const url = showcaseMediaUrl(providerId, item.id);
        return (
          <li key={item.id} className="showcase__item">
            {item.mediaType === "PHOTO" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={item.caption ?? "نمونه‌کار"} loading="lazy" />
            )}
            {item.mediaType === "VIDEO" && <video src={url} controls preload="none" />}
            {item.mediaType === "DOCUMENT" && (
              <a href={url} className="showcase__file">
                دریافت فایل
              </a>
            )}
            {item.caption && <p className="showcase__caption">{item.caption}</p>}
          </li>
        );
      })}
    </ul>
  );
}
