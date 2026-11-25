import type {
  CalendarDay,
  ListingDetails,
  ListingListItem,
  MarketCatalog,
  PageResponse,
  ProviderDetails,
  ProviderListItem,
  ShowcaseCategory,
  ShowcaseItem,
  VenueCatalog,
  VenueDetails,
  VenueListItem,
} from "./types";

/** Server-side address of the backend. The browser never sees it; it uses /api on this site. */
const API_URL = process.env.API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | null,
    message: string,
  ) {
    super(message);
  }
}

type Params = Record<string, string | number | undefined>;

async function get<T>(path: string, params: Params = {}): Promise<T> {
  const url = new URL(path, API_URL);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(name, String(value));
  }
  const response = await fetch(url, { next: { revalidate: 30 } });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    throw new ApiError(response.status, body?.error ?? null, body?.message ?? response.statusText);
  }
  return (await response.json()) as T;
}

/** Runs the request and turns a 404 into null, so a page can call notFound(). */
async function orNull<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function listProviders(q: string | undefined, page: number): Promise<PageResponse<ProviderListItem>> {
  return get("/api/v1/providers", { q, page });
}

export function getProvider(id: number): Promise<ProviderDetails | null> {
  return orNull(get<ProviderDetails>(`/api/v1/providers/${id}`));
}

export function getShowcaseCategories(id: number): Promise<ShowcaseCategory[]> {
  return get(`/api/v1/providers/${id}/showcase/categories`);
}

export function getShowcaseItems(
  id: number,
  category: string,
  page: number,
): Promise<PageResponse<ShowcaseItem> | null> {
  return orNull(get<PageResponse<ShowcaseItem>>(`/api/v1/providers/${id}/showcase`, { category, page, size: 12 }));
}

/** Address of a portfolio picture or video. It goes through this site, so the bot token stays on the server. */
export function showcaseMediaUrl(providerId: number, itemId: number): string {
  return `/api/v1/providers/${providerId}/showcase/${itemId}/media`;
}

export function listVenues(page: number): Promise<PageResponse<VenueListItem>> {
  return get("/api/v1/venues", { page });
}

export function getVenue(id: number): Promise<VenueDetails | null> {
  return orNull(get<VenueDetails>(`/api/v1/venues/${id}`));
}

/** The days the owner marked between two ISO dates (inclusive). */
export function getVenueCalendar(id: number, from: string, to: string): Promise<CalendarDay[]> {
  return get(`/api/v1/venues/${id}/calendar`, { from, to });
}

export function venuePhotoUrl(venueId: number, photoId: number): string {
  return `/api/v1/venues/${venueId}/photos/${photoId}`;
}

export function getVenueCatalog(): Promise<VenueCatalog> {
  return get("/api/v1/venues/catalog");
}

export function getMarketCatalog(): Promise<MarketCatalog> {
  return get("/api/v1/market/catalog");
}

export function listListings(
  q: string | undefined,
  city: string | undefined,
  category: number | undefined,
  page: number,
): Promise<PageResponse<ListingListItem>> {
  return get("/api/v1/market/listings", { q, city, category, page });
}

export function getListing(id: number): Promise<ListingDetails | null> {
  return orNull(get<ListingDetails>(`/api/v1/market/listings/${id}`));
}

export function listingPhotoUrl(listingId: number, photoId: number): string {
  return `/api/v1/market/listings/${listingId}/photos/${photoId}`;
}
