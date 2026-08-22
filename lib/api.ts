import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type {
    User, LoginPayload, RegisterPayload, AuthTokens,
    Tour, Country, Destination, Booking, Review, PaginatedResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Axios Instance ---
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// --- Helper Functions ---
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

// --- Request Interceptor ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Response Interceptor (Refresh Token & Error Handling) ---
api.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<{ detail?: string }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 401 xatolik bo'lsa va bu so'rov hali qayta urinilmagan bo'lsa
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

                    // Qayta so'rov yuborish
                    return api(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    return Promise.reject(refreshError);
                }
            }
        }

        // Xatolik xabarini formatlash
        const detail = error.response?.data?.detail;
        const message = typeof detail === "string" ? detail : "Xatolik yuz berdi";
        return Promise.reject(new Error(message));
    }
);

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

// --- Admin: Tours ---
export interface TourPayload {
    title: string;
    description: string;
    short_description?: string;
    price: number;
    currency: string;
    country: string;
    category: string;
    images: string[];
}

export const createTour = (payload: TourPayload) =>
    api.post<unknown, Tour>("/tours", payload);

export const updateTour = (tourId: string, payload: Partial<TourPayload>) =>
    api.patch<unknown, Tour>(`/tours/${tourId}`, payload);

export const deleteTour = (tourId: string) =>
    api.delete<unknown, void>(`/tours/${tourId}`);

// --- Admin: Users ---
export const getUsers = () => api.get<unknown, User[]>("/users");

// --- Admin: Bookings ---
export const getAllBookings = () => api.get<unknown, Booking[]>("/bookings");

export const updateBookingStatus = (bookingId: string, status: Booking["status"]) =>
    api.patch<unknown, Booking>(`/bookings/${bookingId}/status`, { status });

// --- Admin: Reviews ---
export const deleteReview = (reviewId: string) =>
    api.delete<unknown, void>(`/reviews/${reviewId}`);

export const createReview = (payload: CreateReviewPayload) =>
    api.post<unknown, Review>("/reviews", payload);

export const getReviews = (tourId: string) =>
    api.get<unknown, Review[]>("/reviews", { params: { tour_id: tourId } });

export const getAllReviews = () => api.get<unknown, Review[]>("/reviews");