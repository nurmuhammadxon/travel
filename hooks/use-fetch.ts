"use client";

import { useCallback, useEffect, useState } from "react";

interface UseFetchResult<T> {
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFetch<T>(
    fetcher: () => Promise<T>,
    initialValue: T,
    errorFallback = "Ma'lumotni yuklab bo'lmadi"
): UseFetchResult<T> {
    const [data, setData] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : errorFallback);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { data, setData, isLoading, error, refetch: load };
}