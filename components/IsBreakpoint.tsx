"use client";

import { ReactNode, useEffect, useState } from "react";

const IsBreakpoint = ({
  breakpoint,
  otherwise,
  children,
}: {
  breakpoint: string;
  otherwise?: ReactNode;
  children: ReactNode;
}) => {
  const isBreakpoint = useIsBreakpoint(breakpoint);
  return isBreakpoint ? children : otherwise;
};

const useIsBreakpoint = (breakpoint: string) => {
  const [isBp, setIsBp] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const media = window.matchMedia(`(${breakpoint})`);
    media.addEventListener(
      "change",
      (e) => {
        setIsBp(e.matches);
      },
      { signal: controller.signal },
    );

    setIsBp(media.matches);

    return () => {
      controller.abort();
    };
  }, [breakpoint]);

  return isBp;
};

export default IsBreakpoint;
