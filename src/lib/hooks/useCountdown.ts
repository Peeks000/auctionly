"use client";

import { useState, useEffect } from "react";

export interface CountdownResult {
  timeLeft: string;
  isClosed: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates remaining countdown values for a given end timestamp string.
 */
export function formatCountdownDifference(endTime?: string | null): CountdownResult {
  if (!endTime) {
    return {
      timeLeft: "",
      isClosed: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const difference = new Date(endTime).getTime() - Date.now();
  if (difference <= 0) {
    return {
      timeLeft: "Closed",
      isClosed: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  const timeLeft =
    days > 0 ? `${days}d ${hours}h left` : `${hours}h ${minutes}m ${seconds}s`;

  return {
    timeLeft,
    isClosed: false,
    days,
    hours,
    minutes,
    seconds,
  };
}

/**
 * useCountdown - Live ticking countdown clock hook for auction lots.
 * Automatically clears timer interval on unmount or when auction ends.
 */
export function useCountdown(endTime?: string | null): CountdownResult {
  const [result, setResult] = useState<CountdownResult>(() =>
    formatCountdownDifference(endTime)
  );

  useEffect(() => {
    if (!endTime) {
      setResult({
        timeLeft: "",
        isClosed: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    const tick = () => {
      const next = formatCountdownDifference(endTime);
      setResult(next);
      return next.isClosed;
    };

    const isClosed = tick();
    if (isClosed) return;

    const intervalId = setInterval(() => {
      const closed = tick();
      if (closed) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return result;
}
