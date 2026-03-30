"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type OnViewProps = {
  children: ReactNode;
  rootMargin?: string;
  placeholder?: ReactNode;
};

/**
 * 进入视口后再挂载子组件：用于延后大区块的数据请求与渲染。
 */
export function OnView({
  children,
  rootMargin = "300px 0px",
  placeholder = <div className="section-skeleton mt10" aria-hidden />,
}: OnViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e && e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : placeholder}</div>;
}
