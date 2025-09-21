import { useEffect, useRef, useState } from "react";

/**
 * Mengembalikan true setelah `delay` ms saat `on` = true.
 * Otomatis reset kalau `on` berubah atau data masuk.
 */
export default function useDelayedFlag(on: boolean, delay = 8000) {
  const [flag, setFlag] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlag(false);
    if (on) {
      timerRef.current = setTimeout(() => setFlag(true), delay);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [on, delay]);

  return flag;
}
