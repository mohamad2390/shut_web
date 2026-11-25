"use server";

import { send } from "@/lib/mutate";
import type { MutationResult } from "@/lib/types";

export async function setUserActiveAction(id: number, active: boolean): Promise<MutationResult> {
  return send("PUT", `/api/v1/admin/users/${id}/active`, { active }, ["/admin/users"]);
}

export async function setVenueActiveAction(id: number, active: boolean): Promise<MutationResult> {
  return send("PUT", `/api/v1/admin/venues/${id}/active`, { active }, ["/admin/venues", "/venues", `/venues/${id}`]);
}

export interface ServiceInput {
  name: string;
  icon: string;
  sortOrder: number;
  asksName: boolean;
  active: boolean;
}

export async function createServiceAction(input: ServiceInput): Promise<MutationResult> {
  if (!input.name.trim() || !input.icon.trim()) return { ok: false, message: "اسم و آیکن لازمه." };
  return send("POST", "/api/v1/admin/services", input, ["/admin/services", "/me/pricing"]);
}

export async function updateServiceAction(id: number, input: ServiceInput): Promise<MutationResult> {
  if (!input.name.trim() || !input.icon.trim()) return { ok: false, message: "اسم و آیکن لازمه." };
  return send("PUT", `/api/v1/admin/services/${id}`, input, ["/admin/services", "/me/pricing"]);
}

export async function setUnitIconAction(key: string, icon: string): Promise<MutationResult> {
  if (!icon.trim()) return { ok: false, message: "آیکن رو بنویس." };
  return send("PUT", `/api/v1/admin/units/${encodeURIComponent(key)}`, { icon }, ["/admin/services", "/me/pricing"]);
}

export async function setListingHiddenAction(id: number, hidden: boolean): Promise<MutationResult> {
  return send("PUT", `/api/v1/admin/listings/${id}/hidden`, { hidden }, ["/admin/listings", "/market", `/market/${id}`]);
}
