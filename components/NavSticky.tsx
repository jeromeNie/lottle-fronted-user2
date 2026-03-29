"use client";

import { useEffect, useRef } from "react";

export function NavSticky({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop;
    const onScroll = () => {
      const st = document.documentElement.scrollTop || document.body.scrollTop;
      el.setAttribute("data-fixed", st >= top ? "fixed" : "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="nav2" className="nav2" ref={ref}>
      {children}
    </div>
  );
}
