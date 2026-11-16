"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "auctionly_watchlist";

function getStoredWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredWatchlist(items: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Gracefully handle storage quota or privacy mode limitations
  }
}

/**
 * useWatchlist - Hook for managing lot watchlist persistence and cross-tab sync.
 */
export function useWatchlist(lotId?: string) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const isBookmarked = lotId ? watchlist.includes(lotId) : false;

  const refreshWatchlist = useCallback(() => {
    setWatchlist(getStoredWatchlist());
  }, []);

  useEffect(() => {
    refreshWatchlist();

    const handleStorageChange = () => {
      refreshWatchlist();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshWatchlist]);

  const toggleWatchlist = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!lotId) return;

      const current = getStoredWatchlist();
      let next: string[];
      if (current.includes(lotId)) {
        next = current.filter((id) => id !== lotId);
      } else {
        next = [...current, lotId];
      }
      saveStoredWatchlist(next);
      setWatchlist(next);
    },
    [lotId]
  );

  return {
    watchlist,
    isBookmarked,
    toggleWatchlist,
  };
}
