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
    day_number: number;
    title: string | { uz?: string; ru?: string; en?: string };
    description?: string | { uz?: string; ru?: string; en?: string };
    what_to_expect?: string | { uz?: string; ru?: string; en?: string };
    meals_included?: string[];
    transportation?: {
        type?: string;
        duration?: string;
        distance?: string;
    };
    gallery?: string[];
    accommodation?: {
        name?: string;
        stars?: number;
        address?: string;
        map_url?: string;
        check_in?: string;
        check_out?: string;
        room_type?: string;
        photos?: string[];
    };
}

export interface TourPricingOption {
    id: string;
    type: "group" | "private";
    label: string | { uz?: string; ru?: string; en?: string };
    price: number;
    currency: string;
    min_people?: number;
    max_people?: number;
}

export interface Tour {
    id: string;
    slug: string;
    title: string | { uz: string; ru: string; en: string };
    short_description?: string | { uz?: string; ru?: string; en?: string };
    description?: string | { uz?: string; ru?: string; en?: string };
    category: string;
    duration_days?: number;
    duration_nights?: number;
    price: string | number;
    currency: string;
    cover_image?: string;
    max_group_size?: number;
    is_featured?: boolean;
    is_active?: boolean;
    countries?: Country[];
    itinerary?: TourItineraryDay[];
    reviews?: Review[];
    images?: string[];
    country?: string;
    technical_level?: number;
    min_age?: number;
    fitness_level?: number;
    highlights?: string[] | { uz?: string[]; ru?: string[]; en?: string[] };
    included?: string[] | { uz?: string[]; ru?: string[]; en?: string[] };
    excluded?: string[] | { uz?: string[]; ru?: string[]; en?: string[] };
    faqs?: {
        question: string | { uz?: string; ru?: string; en?: string };
        answer: string | { uz?: string; ru?: string; en?: string };
    }[];
    map_embed_url?: string;
    destinations?: Destination[];
    route_points?: {
        order: number;
        type: "start" | "stop" | "end";
        title: string | { uz?: string; ru?: string; en?: string };
        subtitle?: string | { uz?: string; ru?: string; en?: string };
        has_extra_fee?: boolean;
    }[];
    pricing_options?: TourPricingOption[];
}

export interface TourPayload {
    title: LocalizedText;
    slug?: string;
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
    images: string[];
    technical_level: number | null;
    min_age: number | null;
    fitness_level: number | null;
    highlights: LocalizedList | null;
    included: LocalizedList | null;
    excluded: LocalizedList | null;
    faqs: {
        question: LocalizedText;
        answer: LocalizedText;
    }[];
    map_embed_url: string | null;
    pricing_options: {
        type: string;
        label: LocalizedText;
        price: number;
        currency: string;
        min_people: number;
        max_people: number | null;
    }[];
}

export interface Country {
    id: string;
    name: string;
    slug: string;
    cover_image?: string;
    tour_count?: number;
}

export interface Destination {
    id: string;
    name: string;
    slug: string;
    description?: string;
    cover_image?: string;
    country_id: string;
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
    notes?: string | null;
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

export interface LocalizedList {
    uz: string[];
    ru: string[];
    en: string[];
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

    // Yangi qo'shilgan maydonlar
    images: string[];
    technical_level: number | null;
    min_age: number | null;
    fitness_level: number | null;
    highlights: LocalizedList | null;
    included: LocalizedList | null;
    excluded: LocalizedList | null;
    faqs: {
        question: LocalizedText;
        answer: LocalizedText;
    }[];
    map_embed_url: string | null;
    pricing_options: {
        type: string;
        label: LocalizedText;
        price: number;
        currency: string;
        min_people: number;
        max_people: number | null;
    }[];

    countries?: unknown[];
    destinations?: unknown[];
    reviews?: unknown[];
}

export interface SiteStats {
    years_experience: number;
    satisfaction_percent: number;
    completed_trips: number;
    happy_travelers: number;
}