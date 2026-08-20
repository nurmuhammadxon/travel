"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, LoginPayload, RegisterPayload } from "@/types";
import {
    loginRequest,
    logoutRequest,
    meRequest,
    registerRequest,
    hasStoredSession,
    clearTokens,
} from "@/lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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