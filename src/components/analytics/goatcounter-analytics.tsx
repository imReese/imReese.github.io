"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

type GoatCounterWindow = Window & {
  goatcounter?: {
    count?: (data: { path: string; title: string }) => void;
  };
};

export function GoatCounterAnalytics() {
  const pathname = usePathname();
  const scriptLoaded = useRef(false);
  const lastTrackedPath = useRef<string | null>(null);

  const trackPath = useCallback((path: string) => {
    const goatcounter = (window as GoatCounterWindow).goatcounter;
    if (!goatcounter?.count || lastTrackedPath.current === path) {
      return;
    }

    goatcounter.count({ path, title: document.title });
    lastTrackedPath.current = path;
  }, []);

  useEffect(() => {
    if (scriptLoaded.current) {
      trackPath(pathname || "/");
    }
  }, [pathname, trackPath]);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const siteUrl = process.env.NEXT_PUBLIC_GOATCOUNTER_URL;
  if (!siteUrl) {
    return null;
  }

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={`${siteUrl.replace(/\/$/, "")}/count`}
      data-goatcounter-settings='{"no_onload":true}'
      strategy="afterInteractive"
      onLoad={() => {
        scriptLoaded.current = true;
        trackPath(pathname || "/");
      }}
    />
  );
}
