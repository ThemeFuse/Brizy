import { forwardRef, useEffect, useRef } from "react";
import { isHTMLElement } from "visual/utils/dom/isHTMLElement";
import { Headline } from "./Headline";
import { Settings } from "./types";

export const AnimatedHeadline = forwardRef<HTMLDivElement, Settings>(
  (settings, wrapperRef) => {
    const controller = useRef<Headline | null>(null);

    useEffect(() => {
      const ref =
        typeof wrapperRef == "function"
          ? wrapperRef(null)
          : wrapperRef?.current;

      if (isHTMLElement(ref)) {
        controller.current = new Headline(ref, settings);
      }

      return () => {
        return controller.current?.clearAnimation();
      };
    }, [settings, wrapperRef]);

    return null;
  }
);
