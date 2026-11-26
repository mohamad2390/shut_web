/** The shapes the backend API returns (see the README of the backend, "API برای وب‌اپ"). */

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface Rating {
  average: number;
  count: number;
}

export interface ProviderListItem {
  userId: number;
  displayName: string;
  city: string | null;
  rating: Rating;
  skills: string[];
}

export interface EquipmentItem {
  type: string;
  brand: string;
  model: string;
}

export interface ProviderDetails {
  userId: number;
  displayName: string;
  headline: string | null;
  bio: string | null;
  yearsExperience: number | null;
  city: string | null;
  country: string | null;
  websiteUrl: string | null;
  instagramUsername: string | null;
  telegramUsername: string | null;
  equipmentNotes: string | null;
  equipment: EquipmentItem[];
  skills: string[];
  serviceCities: string[];
  collaborators: string[];
  rating: Rating;
}

export interface Label {
  key: string;
  label: string;
}

export interface ShowcaseCategory {
  category: Label;
  count: number;
}

export type MediaType = "PHOTO" | "VIDEO" | "DOCUMENT";

export interface ShowcaseItem {
  id: number;
  mediaType: MediaType;
  caption: string | null;
}

export interface VenuePrice {
  title: string | null;
  unit: Label;
  amount: number;
}

export interface VenueListItem {
  id: number;
  name: string;
  type: Label | null;
  city: string;
  prices: VenuePrice[];
  photoCount: number;
}

export interface VenueDetails {
  id: number;
  name: string;
  type: Label | null;
  city: string;
  address: string | null;
  description: string | null;
  amenities: string | null;
  phone: string | null;
  ownerTelegramUsername: string | null;
  prices: VenuePrice[];
  photos: { id: number }[];
}

export type CalendarStatus = "FREE" | "BUSY";

export interface CalendarDay {
  /** Gregorian ISO date, e.g. 2026-12-01 */
  date: string;
  status: CalendarStatus;
}

/** The signed-in member. telegramLinked is false for an account that has only used the web. */
export interface Me {
  id: number;
  displayName: string | null;
  phone: string | null;
  telegramLinked: boolean;
  provider: boolean;
}

export interface LoginResult {
  token: string;
  expiresAt: string;
  user: Me;
}

/** The member's own specialist profile; registered is false until they save it for the first time. */
export interface MyProfile {
  registered: boolean;
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  yearsExperience: number | null;
  baseCity: string | null;
  baseCountry: string | null;
  websiteUrl: string | null;
  instagramUsername: string | null;
  equipmentDescription: string | null;
  skills: string[];
  serviceCities: string[];
  collaborators: string[];
}

export interface PriceUnit {
  key: string;
  /** Reads after the amount: «هر ساعت» */
  label: string;
  icon: string;
}

export interface PriceService {
  id: number;
  name: string;
  icon: string;
  /** The member may name the price themselves («سایر») */
  asksName: boolean;
}

export interface PriceItem {
  id: number;
  title: string;
  icon: string;
  serviceId: number | null;
  unit: PriceUnit;
  /** In tomans */
  amount: number;
}

export interface PricingCatalog {
  services: PriceService[];
  units: PriceUnit[];
  maxItems: number;
  maxAmount: number;
}

/** What the member has in their showcase. It can only be filled in the Telegram bot. */
export interface MyShowcase {
  categories: ShowcaseCategory[];
  total: number;
  botUrl: string | null;
}

export type MutationResult = { ok: true } | { ok: false; message: string };

// ---- venue booking and the owner's own venues ----

export interface VenueTypeOption {
  key: string;
  label: string;
  icon: string;
}

export interface VenueCatalog {
  types: VenueTypeOption[];
  priceUnits: Label[];
  maxVenuesPerOwner: number;
  maxPrices: number;
  maxPhotos: number;
}

/** A request to book a venue. status.key: PENDING, ACCEPTED, DECLINED… */
export interface Booking {
  id: number;
  venueId: number;
  venueName: string;
  /** Gregorian ISO date */
  date: string;
  /** HH:mm:ss, null for a whole day */
  startTime: string | null;
  endTime: string | null;
  fullDay: boolean;
  note: string | null;
  status: Label;
}

export interface MyVenueSummary {
  id: number;
  name: string;
  type: Label | null;
  city: string | null;
  active: boolean;
  listed: boolean;
  pendingRequests: number;
  priceCount: number;
  photoCount: number;
}

export interface MyVenuePrice {
  id: number;
  title: string | null;
  unit: Label;
  amount: number;
}

export interface MyVenueDetails {
  id: number;
  name: string;
  type: Label | null;
  city: string | null;
  address: string | null;
  description: string | null;
  amenities: string | null;
  phone: string | null;
  active: boolean;
  listed: boolean;
  /** What keeps the venue out of the public list: CITY, PRICE */
  missing: string[];
  prices: MyVenuePrice[];
  photoCount: number;
  botUrl: string | null;
}

export interface OwnerRequest {
  id: number;
  date: string;
  startTime: string | null;
  endTime: string | null;
  fullDay: boolean;
  note: string | null;
  requester: { name: string | null; telegramUsername: string | null; phone: string | null };
}

// ---- admin ----

export interface AdminUser {
  id: number;
  name: string | null;
  phone: string | null;
  telegramUsername: string | null;
  telegramLinked: boolean;
  roles: string[];
  active: boolean;
  createdAt: string;
}

export interface AdminVenue {
  id: number;
  name: string;
  type: Label | null;
  city: string | null;
  ownerId: number;
  ownerName: string | null;
  active: boolean;
  listed: boolean;
  priceCount: number;
  photoCount: number;
  pendingRequests: number;
}

export interface AdminService {
  id: number;
  name: string;
  icon: string;
  sortOrder: number;
  active: boolean;
  asksName: boolean;
}

export interface AdminUnit {
  key: string;
  label: string;
  icon: string;
}

// ---- gear market ----

export interface MarketCategory {
  id: number;
  name: string;
  icon: string;
}

export interface MarketCatalog {
  categories: MarketCategory[];
  conditions: Label[];
  maxActiveListings: number;
  maxPhotos: number;
}

export interface ListingListItem {
  id: number;
  title: string;
  condition: Label;
  category: string | null;
  brand: string | null;
  model: string | null;
  /** In tomans */
  price: number;
  negotiable: boolean;
  city: string | null;
  firstPhotoId: number | null;
}

export interface ListingDetails {
  id: number;
  title: string;
  description: string | null;
  category: MarketCategory | null;
  brand: string | null;
  model: string | null;
  condition: Label;
  price: number;
  negotiable: boolean;
  city: string | null;
  sellerName: string | null;
  photoIds: number[];
  createdAt: string;
}

/** The seller's own view; status.key is ACTIVE, SOLD or CLOSED. */
export interface MyListing {
  id: number;
  title: string;
  description: string | null;
  category: MarketCategory | null;
  brand: string | null;
  model: string | null;
  condition: Label;
  price: number;
  negotiable: boolean;
  city: string | null;
  status: Label;
  hidden: boolean;
  photoCount: number;
  pendingOffers: number;
  botUrl: string | null;
}

export interface Contact {
  name: string | null;
  telegramUsername: string | null;
  phone: string | null;
}

/** An offer the member made; seller is only there once it was accepted. */
export interface MyOffer {
  id: number;
  listingId: number;
  listingTitle: string;
  amount: number | null;
  message: string | null;
  status: Label;
  createdAt: string;
  seller: Contact | null;
}

export interface SellerOffer {
  id: number;
  amount: number | null;
  message: string | null;
  createdAt: string;
  buyer: Contact;
}

export interface AdminListing {
  id: number;
  title: string;
  price: number;
  status: Label;
  hidden: boolean;
  sellerId: number;
  sellerName: string | null;
  photoCount: number;
  pendingOffers: number;
}

export interface StudioListItem {
  id: number;
  name: string;
  city: string;
  offeringCount: number;
  mediaCount: number;
}

export interface StudioOffering {
  id: number;
  title: string;
  /** Catalog services in the package, e.g. «📸 عکاسی». */
  services: string[];
  /** Null means «با تماس». */
  price: number | null;
}

export interface StudioDetails {
  id: number;
  name: string;
  managerName: string;
  phone: string;
  city: string;
  address: string;
  description: string | null;
  ownerTelegramUsername: string | null;
  offerings: StudioOffering[];
  media: { id: number; kind: "PHOTO" | "VIDEO" }[];
  people: { userId: number; name: string }[];
}

export interface RentalShopListItem {
  id: number;
  name: string;
  city: string;
  itemCount: number;
}

export interface RentalItemSummary {
  id: number;
  title: string;
  typeIcon: string | null;
  typeName: string;
  dailyPrice: number;
  photoCount: number;
}

export interface RentalSearchItem extends RentalItemSummary {
  shopId: number;
  shopName: string;
  shopCity: string;
}

export interface RentalShopDetails {
  id: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  description: string | null;
  ownerTelegramUsername: string | null;
  items: RentalItemSummary[];
}

export interface RentalItemDetails {
  id: number;
  title: string;
  typeIcon: string | null;
  typeName: string;
  description: string | null;
  dailyPrice: number;
  shopId: number;
  shopName: string;
  shopPhone: string;
  shopCity: string;
  shopAddress: string;
  ownerTelegramUsername: string | null;
  photoIds: number[];
}
