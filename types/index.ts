export type UserRole = "customer" | "admin";

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
    status: "pending" | "confirmed" | "completed" | "cancelled";
    total_price: number;
    tour_date: string;
    num_adults: number;
    num_children: number;
    can_review?: boolean;
}

export interface Review {
    id: string;
    tour_id: string;
    rating: number;
    text: string;
    images: string[];
    reviewer_country?: string;
    created_at?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
}