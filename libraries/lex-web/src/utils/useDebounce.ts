/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";

export type DebouncedCallback = (...args: any) => void;

export function useDebounce(callback:
  (...args: any) => void, delay: number): DebouncedCallback
{
  const timeoutRef = useRef<number | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: any) => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}
