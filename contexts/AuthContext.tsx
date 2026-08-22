"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, LoginPayload, RegisterPayload } from "@/types";
import {
    loginRequest,
    logoutRequest,
    meRequest,
    registerRequest,
    hasStoredSession,
    clearTokens,
} from "@/lib/api";
import { showInfo } from "@/lib/toast";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 30 daqiqa faolsizlikdan keyin avtomatik chiqarish
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!hasStoredSession()) {
            setIsLoading(false);
            return;
        }

        meRequest()
            .then(setUser)
            .catch(() => {
                clearTokens();
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function login(payload: LoginPayload) {
        const loggedInUser = await loginRequest(payload);
        setUser(loggedInUser);
    }

    async function register(payload: RegisterPayload) {
        await registerRequest(payload);
        await login({ email: payload.email, password: payload.password });
    }

    async function logout() {
        await logoutRequest();
        setUser(null);
    }

    // Faolsizlik taymerini boshqarish — faqat login qilingan holatda ishlaydi
    useEffect(() => {
        if (!user) return;

        function resetTimer() {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            inactivityTimer.current = setTimeout(async () => {
                await logoutRequest();
                setUser(null);
                showInfo("Faolsizlik tufayli tizimdan chiqarildingiz");
                router.push("/login");
            }, INACTIVITY_LIMIT_MS);
        }

        ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
        resetTimer(); // birinchi marta taymerni ishga tushirish

        return () => {
            ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, [user, router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak");
    return ctx;
}