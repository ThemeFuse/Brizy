import React, { useEffect, useRef } from "react";
import { FCC } from "visual/utils/react/types";
import { Headline } from "./Headline";
import { Settings } from "./types";

export const AnimatedHeadline: FCC<Settings> = (settings) => {
  const controller = useRef<Headline | null>(null);
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapper.current) {
      controller.current = new Headline(wrapper.current, settings);
    }

    return () => {
      return controller.current?.clearAnimation();
    };
  }, [settings]);

  return <div ref={wrapper} />;
};
