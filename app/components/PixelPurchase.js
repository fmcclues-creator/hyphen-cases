"use client";

import { useEffect, useRef } from "react";

/**
 * Fires one Meta "Purchase" event on the confirmation page.
 *
 * Guarded twice: a ref so a re-render can't double-count, and sessionStorage
 * keyed on the order code so a refresh or a back-then-forward doesn't either.
 * Test checkouts (?test=1) never fire — otherwise your own testing would
 * teach Meta's optimiser to chase fake buyers.
 */
export default function PixelPurchase({ code, value, currency = "KWD" }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const key = `fbq_purchase_${code || "nocode"}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch (e) {
      /* private mode — fall through and accept the small double-count risk */
    }

    const fire = () => {
      if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
      window.fbq("track", "Purchase", {
        value: Number(value) || 0,
        currency,
        content_type: "product",
        content_name: "قضية خالد",
      });
      try {
        sessionStorage.setItem(key, "1");
      } catch (e) {}
      return true;
    };

    // The pixel loads with strategy "afterInteractive", so fbq may not exist yet.
    if (fire()) return;
    let tries = 0;
    const iv = setInterval(() => {
      if (fire() || ++tries > 40) clearInterval(iv); // give up after ~8s
    }, 200);
    return () => clearInterval(iv);
  }, [code, value, currency]);

  return null;
}
