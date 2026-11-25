import { ratingText } from "@/lib/format";
import type { Rating as RatingValue } from "@/lib/types";

/** The average as a bar out of 5 plus the numbers, so it reads without colour. */
export function Rating({ value }: { value: RatingValue }) {
  const filled = value.count === 0 ? 0 : Math.min(100, (value.average / 5) * 100);
  return (
    <div className="rating">
      <span className="rating__bar" aria-hidden="true">
        <span className="rating__fill" style={{ width: `${filled}%` }} />
      </span>
      <span className="rating__text">{ratingText(value.average, value.count)}</span>
    </div>
  );
}
