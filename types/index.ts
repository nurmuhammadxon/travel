export type UserRole = "customer" | "agent" | "admin";

export interface User {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    preferred_language: "uz" | "ru" | "en" | string;
    created_at: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    preferred_language?: "uz" | "ru" | "en";
}

export interface TourItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface Tour {
    id: string;
    slug: string;
    title: string;
    description: string;
    short_description?: string;
    price: number;
    currency: string;
    country: string;
    category: string;
    images: string[];
    itinerary?: TourItineraryDay[];
    reviews?: Review[];
    is_featured?: boolean;
}

export interface Country {
    slug: string;
    name: string;
}

export interface Destination {
    slug: string;
    name: string;
    country_slug: string;
}

export interface Booking {
    id: string;
    booking_number: string;
    tour_id: string;
    full_name: string;
    email: string;
    phone: string;
    tour_date: string;
    num_adults: number;
    num_children: number;
    total_price: string;
    currency: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    created_at: string;
    can_review: boolean;
}

export interface Review {
    id: string;
    tour_id: string;
    reviewer_name: string;
    rating: number;
    text: string;
    images: string[];
    reviewer_country?: string;
    is_verified?: boolean;
    source?: string;
    source_url?: string;
    created_at?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
}

export interface LocalizedText {
    uz: string;
    ru: string;
    en: string;
}

export interface AdminTourDetail {
    id: string;
    slug: string;
    title: LocalizedText;
    short_description: LocalizedText;
    description: LocalizedText;
    category: string;
    duration_days: number;
    duration_nights: number;
    price: number;
    currency: string;
    cover_image: string;
    max_group_size: number;
    is_featured: boolean;
    is_active: boolean;
    country_ids: string[];
    destination_ids: string[];
    itinerary: unknown[];
}