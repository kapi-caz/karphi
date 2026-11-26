'use client'
import { useSyncExternalStore } from 'react';
import { Themes } from '../data/themes';

const STORAGE_KEY = 'karphi-theme';
export const DEFAULT_THEME = 'retro';

const listeners = new Set<() => void>();
// In-memory fallback for when localStorage is unavailable (e.g. privacy mode).
let memoryTheme: string | null = null;

function read(): string {
    let value = memoryTheme;
    try {
        value = window.localStorage.getItem(STORAGE_KEY) ?? memoryTheme;
    } catch {
        /* ignore */
    }
    return value && Themes[value] ? value : DEFAULT_THEME;
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    window.addEventListener('storage', callback);
    return () => {
        listeners.delete(callback);
        window.removeEventListener('storage', callback);
    };
}

export function setTheme(key: string) {
    if (!Themes[key]) return;
    memoryTheme = key;
    try {
        window.localStorage.setItem(STORAGE_KEY, key);
    } catch {
        /* ignore */
    }
    listeners.forEach((l) => l());
}

/** Current theme key, persisted in localStorage. Server render always uses the default. */
export function useThemeKey(): string {
    return useSyncExternalStore(subscribe, read, () => DEFAULT_THEME);
}
