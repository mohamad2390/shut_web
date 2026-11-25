import { addDays, jalali } from "@/lib/format";
import type { CalendarDay } from "@/lib/types";

type DayState = CalendarDay["status"] | "UNKNOWN";

const STATE_TEXT: Record<DayState, string> = { FREE: "آزاد", BUSY: "پر", UNKNOWN: "نامشخص" };

/** The next days in the Persian calendar. A day the owner has not marked is «نامشخص»: ask them. */
export function VenueCalendar({ from, days, marked }: { from: string; days: number; marked: CalendarDay[] }) {
  const byDate = new Map(marked.map((day) => [day.date, day.status]));
  const cells = Array.from({ length: days }, (_, index) => {
    const date = addDays(from, index);
    const status: DayState = byDate.get(date) ?? "UNKNOWN";
    return { date, status };
  });
  return (
    <ul className="days">
      {cells.map(({ date, status }) => (
        <li key={date} className={`day day--${status.toLowerCase()}`}>
          {jalali(date)}
          <span className="day__state">{STATE_TEXT[status]}</span>
        </li>
      ))}
    </ul>
  );
}
