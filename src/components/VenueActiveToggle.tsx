"use client";

import { setVenueActiveAction } from "@/app/admin/actions";
import { ActiveToggle } from "@/components/ActiveToggle";

export function VenueActiveToggle({ id, active }: { id: number; active: boolean }) {
  return (
    <ActiveToggle
      active={active}
      onLabel="غیرفعال کن"
      offLabel="فعال کن"
      confirmOff="این مکان از فهرست عمومی برداشته بشه؟"
      action={(next) => setVenueActiveAction(id, next)}
    />
  );
}
