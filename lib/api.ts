import type {
    User, LoginPayload, RegisterPayload, AuthTokens,
    Tour, Country, Destination, Booking, Review, PaginatedResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
}

export function setTokens(tokens: AuthTokens) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

export function hasStoredSession(): boolean {
    return !!getRefreshToken();
}

async function refreshAccessToken(): Promise<string | null> {
    const refresh_token = getRefreshToken();
    if (!refresh_token) return null;

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
        clearTokens();
        return null;
    }

    const data: AuthTokens = await res.json();
    setTokens(data);
    return data.access_token;
}

async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) return apiFetch<T>(path, options, false);
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: "Xatolik yuz berdi" }));
        const message = typeof error.detail === "string" ? error.detail : "Xatolik yuz berdi";
        throw new Error(message);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

// --- Auth ---
export const registerRequest = (payload: RegisterPayload) =>
    apiFetch<User>("/auth/register", { method: "POST", body: JSON.stringify(payload) });

export async function loginRequest(payload: LoginPayload): Promise<User> {
    const tokens = await apiFetch<AuthTokens>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    setTokens(tokens);
    return meRequest();
}

export const meRequest = () => apiFetch<User>("/auth/me");

export async function logoutRequest() {
    clearTokens();
}

// --- Tours ---
export function getTours(params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiFetch<PaginatedResponse<Tour>>(`/tours${query ? `?${query}` : ""}`);
}

export const getTourBySlug = (slug: string, lang: string) =>
    apiFetch<Tour>(`/tours/${slug}?lang=${lang}`);

export const getCountries = (lang: string) => apiFetch<Country[]>(`/countries?lang=${lang}`);

export const getDestinations = (lang: string, countrySlug?: string) =>
    apiFetch<Destination[]>(
        `/destinations?lang=${lang}${countrySlug ? `&country_slug=${countrySlug}` : ""}`
    );

// --- Bookings ---
export interface CreateBookingPayload {
    tour_id: string;
    full_name: string;
    email: string;
    phone: string;
    tour_date: string;
    num_adults: number;
    num_children: number;
    notes?: string;
}

export const createBooking = (payload: CreateBookingPayload) =>
    apiFetch<Booking>("/bookings", { method: "POST", body: JSON.stringify(payload) });

export const initPayment = (bookingId: string, provider: "payme" | "click" | "stripe") =>
    apiFetch<{ payment_url: string; amount: string; currency: string }>("/payments/init", {
        method: "POST",
        body: JSON.stringify({ booking_id: bookingId, provider }),
    });

export const getBookingByNumber = (bookingNumber: string) =>
    apiFetch<Booking>(`/bookings/${bookingNumber}`);

export const getMyBookings = () => apiFetch<Booking[]>("/bookings/my");

// --- Reviews ---
export async function uploadReviewImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/reviews/upload-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
    });

    if (!res.ok) throw new Error("Rasm yuklashda xatolik");
    return res.json();
}

export interface CreateReviewPayload {
    tour_id: string;
    rating: number;
    text: string;
    images: string[];
    reviewer_country?: string;
}

export const createReview = (payload: CreateReviewPayload) =>
    apiFetch<Review>("/reviews", { method: "POST", body: JSON.stringify(payload) });

export const getReviews = (tourId: string) => apiFetch<Review[]>(`/reviews?tour_id=${tourId}`);