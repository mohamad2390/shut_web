import { toman } from "@/lib/format";
import type { VenuePrice } from "@/lib/types";

/** Every price a venue offers: «ساعتی ۳٬۰۰۰٬۰۰۰ تومان»; a custom name leads when there is one («خصوصی»). */
export function PriceList({ prices, large = false }: { prices: VenuePrice[]; large?: boolean }) {
  return (
    <ul className={large ? "prices prices--large" : "prices"}>
      {prices.map((price, index) => (
        <li key={index}>
          <span className="prices__label">
            {price.title ? `${price.title} (${price.unit.label})` : price.unit.label}
          </span>
          <span className="prices__amount">{toman(price.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
