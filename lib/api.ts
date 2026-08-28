import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import type {
    User, LoginPayload, RegisterPayload, AuthTokens,
    Tour, Country, Destination, Booking, Review, PaginatedResponse,
    LocalizedText, AdminTourDetail,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && process.env.NODE_ENV === "development") {
    console.warn("DIQQAT: NEXT_PUBLIC_API_URL faylida ko'rsatilmagan!");
}

export const api = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

// --- Helper Functions (Cookies) ---
export function setTokens(tokens: AuthTokens) {
    if (typeof window === "undefined" || !tokens) return;

    const isSecure = window.location.protocol === "https:";

    if (tokens.access_token) {
        Cookies.set("access_token", tokens.access_token, {
            expires: 7,
            secure: isSecure,
            sameSite: "lax",
        });
    }
    if (tokens.refresh_token) {
        Cookies.set("refresh_token", tokens.refresh_token, {
            expires: 7,
            secure: isSecure,
            sameSite: "lax",
        });
    }
}
function getAccessToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get("access_token");
}

function getRefreshToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get("refresh_token");
}

export function clearTokens() {
    if (typeof window === "undefined") return;
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
}

export function hasStoredSession(): boolean {
    return !!getRefreshToken();
}

// --- Request Interceptor ---
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = getAccessToken();

            // LOG: Token bor yoki yo'qligini tekshirish uchun
            if (process.env.NODE_ENV === "development") {
                console.log(`[Request: ${config.method?.toUpperCase()}] ${config.url} | Token:`, token ? "Mavjud" : "TOPILMADI!");
            }

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// --- Single Response Interceptor (Data Unwrap + Refresh Token Logic) ---
function formatErrorDetail(detail: unknown): string {
    if (!detail) return "Xatolik yuz berdi";

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
        const messages = detail.map((item) => {
            if (item && typeof item === "object") {
                const loc = Array.isArray((item as { loc?: unknown[] }).loc)
                    ? (item as { loc: unknown[] }).loc
                        .filter((part) => part !== "body")
                        .join(".")
                    : "";
                const msg = (item as { msg?: string }).msg ?? JSON.stringify(item);
                return loc ? `${loc}: ${msg}` : msg;
            }
            return String(item);
        });
        return messages.join("; ");
    }

    if (typeof detail === "object") {
        try {
            return JSON.stringify(detail);
        } catch {
            return "Xatolik yuz berdi";
        }
    }

    return "Xatolik yuz berdi";
}

export interface ApiError extends Error {
    status?: number;
    detail?: unknown;
}

// --- Response Interceptor (Refresh Token & Error Handling) ---
api.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<{ detail?: unknown }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _timeoutRetry?: boolean };

        if (error.code === "ECONNABORTED" && originalRequest && !originalRequest._timeoutRetry) {
            originalRequest._timeoutRetry = true;
            originalRequest.timeout = 60000;
            return api(originalRequest);
        }

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    // Tokenni yangilash uchun alohida axios so'rovi (cheksiz siklga tushmaslik uchun)
                    const res = await axios.post<AuthTokens>(`${API_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    setTokens(res.data);
                    originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    return Promise.reject(refreshError);
                }
            }
        }

        const detail = error.response?.data?.detail;
        const message = error.response
            ? formatErrorDetail(detail)
            : `Server bilan bog'lanib bo'lmadi (${error.code ?? "network error"}: ${error.message}). Sabablari: CORS ruxsat yo'q, backend o'chgan/uxlab yotibdi (Render cold start), yoki internet aloqasi yo'q.`;

        if (process.env.NODE_ENV !== "production") {
            console.error(
                `[API xatosi ${error.response?.status ?? "NO RESPONSE"}] ${originalRequest?.method?.toUpperCase() ?? ""} ${originalRequest?.url ?? ""}\n${message}`
            );
        }

        const formattedError: ApiError = new Error(message);
        formattedError.status = error.response?.status;
        formattedError.detail = detail;
        return Promise.reject(formattedError);
    });

// --- Auth ---
export const registerRequest = (payload: RegisterPayload) =>
    api.post<unknown, User>("/auth/register", payload);

export async function loginRequest(payload: LoginPayload): Promise<User> {
    const tokens = await api.post<unknown, AuthTokens>("/auth/login", payload);
    setTokens(tokens);
    return meRequest();
}

export const meRequest = () => api.get<unknown, User>("/auth/me");

export async function logoutRequest() {
    clearTokens();
}

// --- Tours ---
export function getTours(params: Record<string, string | number | undefined> = {}) {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
    );
    return api.get<unknown, PaginatedResponse<Tour>>("/tours", { params: filteredParams });
}

export const getTourBySlug = (slug: string, lang: string) =>
    api.get<unknown, Tour>(`/tours/${slug}`, { params: { lang } });

export const getCountries = (lang: string) =>
    api.get<unknown, Country[]>("/countries", { params: { lang } });

export const getDestinations = (lang: string, countrySlug?: string) =>
    api.get<unknown, Destination[]>("/destinations", {
        params: { lang, country_slug: countrySlug },
    });

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
    api.post<unknown, Booking>("/bookings", payload);

export const initPayment = (bookingId: string, provider: "payme" | "click" | "stripe") =>
    api.post<unknown, { payment_url: string; amount: string; currency: string }>(
        "/payments/init",
        { booking_id: bookingId, provider }
    );

export const getBookingByNumber = (bookingNumber: string) =>
    api.get<unknown, Booking>(`/bookings/${bookingNumber}`);

export const getMyBookings = () => api.get<unknown, Booking[]>("/bookings/my");

// --- Reviews ---
export async function uploadReviewImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<unknown, { url: string }>("/reviews/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export interface CreateReviewPayload {
    tour_id: string;
    rating: number;
    text: string;
    images: string[];
    reviewer_country?: string;
}

export const createReview = (payload: CreateReviewPayload) =>
    api.post<unknown, Review>("/reviews", payload);

export const getReviews = (tourId: string) =>
    api.get<unknown, Review[]>("/reviews", { params: { tour_id: tourId } });

// --- Admin Interface & API Methods ---

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
    is_featured?: boolean;
    is_active?: boolean;
    country_ids: string[];
    destination_ids: string[];
    itinerary: unknown[];
}

export interface SiteStats {
    years_experience: number;
    satisfaction_percent: number;
    completed_trips: number;
    happy_travelers: number;
}

// --- Profile  ---
export interface UpdateProfilePayload {
    full_name?: string;
    email?: string;
    phone?: string;
    preferred_language?: "uz" | "ru" | "en";
}

export const getProfile = () => api.get<unknown, User>("/users/me");

export const updateProfile = (payload: UpdateProfilePayload) =>
    api.patch<unknown, User>("/users/me", payload);

// Admin: Users
export const getUsers = () => api.get<unknown, User[]>("/users");

// Admin: Tours
export const getTourRaw = (slug: string) =>
    api.get<unknown, AdminTourDetail>(`/tours/${slug}`);

export const createTour = (payload: TourPayload) =>
    api.post<unknown, Tour>("/tours", payload);

export const updateTour = (tourId: string, payload: Partial<TourPayload>) =>
    api.patch<unknown, Tour>(`/tours/${tourId}`, payload);

export const deleteTour = (tourId: string) =>
    api.delete<unknown, void>(`/tours/${tourId}`);

// Admin: Bookings
export const getAllBookings = () => api.get<unknown, Booking[]>("/bookings");

export const updateBookingStatus = (bookingId: string, status: Booking["status"]) =>
    api.patch<unknown, Booking>(`/bookings/${bookingId}/status`, { status });

export const autoCompleteBookings = () =>
    api.post<unknown, { message: string }>("/bookings/auto-complete");

// Admin: Reviews & Locations
export const getAllReviews = () => api.get<unknown, Review[]>("/reviews");

export const deleteReview = (reviewId: string) =>
    api.delete<unknown, void>(`/reviews/${reviewId}`);

export const createCountry = (payload: { name: Record<string, string>; slug: string }) =>
    api.post<unknown, Country>("/countries", payload);

export const createDestination = (payload: { name: Record<string, string>; country_slug: string; slug: string }) =>
    api.post<unknown, Destination>("/destinations", payload);

// Admin: Site Stats
export const getSiteStats = () =>
    api.get<unknown, SiteStats>("/site-stats");

export const updateSiteStats = (payload: Partial<SiteStats>) =>
    api.patch<unknown, SiteStats>("/site-stats", payload);

export default api;