"use client";

/**
 * Send a standard Meta pixel event, waiting briefly if the pixel script
 * (loaded "afterInteractive") isn't ready yet. Resolves true once sent.
 */
export function pixelTrack(event, params = {}) {
  return new Promise((resolve) => {
    const fire = () => {
      if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
      window.fbq("track", event, params);
      return true;
    };
    if (fire()) return resolve(true);
    let tries = 0;
    const iv = setInterval(() => {
      if (fire()) { clearInterval(iv); resolve(true); }
      else if (++tries > 25) { clearInterval(iv); resolve(false); } // give up after ~5s
    }, 200);
  });
}
