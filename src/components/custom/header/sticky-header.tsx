"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import useWindowScroll from "react-use/lib/useWindowScroll";

/* Hook */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

type StickyHeaderProps = {
  className?: string;
  offset?: number;
};

export default function StickyHeader({
  offset = 2,
  className,
  children,
}: React.PropsWithChildren<StickyHeaderProps>) {
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();
  return (
    <header
      className={cn(
        "sticky top-0 flex items-center p-1 backdrop-blur-3xl",
        ((isMounted && windowScroll.y) as number) > offset ? "card-shadow" : "",
        className
      )}
    >
      {children}
    </header>
  );
}
