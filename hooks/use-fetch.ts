"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError } from "@/lib/api";

interface UseFetchResult<T> {
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    isLoading: boolean;
    isRetrying: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const RETRY_DELAYS_MS = [3000, 6000, 10000, 15000, 20000]; 

export function useFetch<T>(
    fetcher: () => Promise<T>,
    initialValue: T,
    errorFallback = "Ma'lumotni yuklab bo'lmadi"
): UseFetchResult<T> {
    const [data, setData] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const attemptRef = useRef(0);

    const load = useCallback(async () => {
        attemptRef.current = 0;
        setIsLoading(true);
        setIsRetrying(false);
        setError(null);

        for (; ;) {
            try {
                const result = await fetcher();
                setData(result);
                setError(null);
                break;
            } catch (err) {
                const apiErr = err as ApiError;
                const isColdStartLike = apiErr?.status === undefined;
                const canRetry = isColdStartLike && attemptRef.current < RETRY_DELAYS_MS.length;

                if (canRetry) {
                    setIsRetrying(true);
                    const delay = RETRY_DELAYS_MS[attemptRef.current];
                    attemptRef.current += 1;
                    await new Promise((res) => setTimeout(res, delay));
                    continue;
                }

                setError(err instanceof Error ? err.message : errorFallback);
                break;
            }
        }

        setIsLoading(false);
        setIsRetrying(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { data, setData, isLoading, isRetrying, error, refetch: load };
}