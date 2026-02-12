import { useState, useEffect, useRef, useCallback } from 'react';

type WorkerMessage = {
    type: string;
    payload: any;
    id: string;
};

type WorkerResponse = {
    type: "SUCCESS" | "ERROR";
    result?: any;
    error?: string;
    id: string;
};

export function useWorker() {
    const workerRef = useRef<Worker | null>(null);
    const promisesRef = useRef<Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>>(new Map());

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/process.worker.ts', import.meta.url));

        workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const { id, type, result, error } = e.data;
            const promise = promisesRef.current.get(id);

            if (promise) {
                if (type === "SUCCESS") {
                    promise.resolve(result);
                } else {
                    promise.reject(new Error(error));
                }
                promisesRef.current.delete(id);
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const runTask = useCallback((type: string, payload: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            // crypto.randomUUID is only available in secure contexts (HTTPS/localhost)
            // We use a simple fallback for network host (HTTP) support
            const id = typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2) + Date.now().toString(36);
            promisesRef.current.set(id, { resolve, reject });
            workerRef.current?.postMessage({ type, payload, id });
        });
    }, []);

    return { runTask };
}
