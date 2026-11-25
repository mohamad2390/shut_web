"use client";

import { setListingHiddenAction } from "@/app/admin/actions";
import { ActiveToggle } from "@/components/ActiveToggle";

/** Shows or hides a listing. The toggle is «on» while the listing is shown. */
export function ListingHiddenToggle({ id, hidden }: { id: number; hidden: boolean }) {
  return (
    <ActiveToggle
      active={!hidden}
      onLabel="مخفی کن"
      offLabel="نمایش بده"
      confirmOff="این آگهی از بازار مخفی بشه؟"
      action={(shown) => setListingHiddenAction(id, !shown)}
    />
  );
}
