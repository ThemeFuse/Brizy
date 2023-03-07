import { MouseEvent, TouchEvent } from "react";
import { HSLAwithSource } from "visual/component/Controls/ColorPicker2/types";

import HSLA = tinycolor.ColorFormats.HSLA;

type Props = {
  e: MouseEvent | TouchEvent;
  contentWindow: Window;
  hsl: HSLA;
  direction: string;
  container: HTMLDivElement | null;
};

export const calculateChange = ({
  e,
  contentWindow,
  hsl,
  direction,
  container
}: Props): HSLAwithSource | null => {
  e.preventDefault();
  if (!container) return null;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  // @ts-expect-error event type err
  const x = typeof e.pageX === "number" ? e.pageX : e.touches[0].pageX;
  // @ts-expect-error event type err
  const y = typeof e.pageY === "number" ? e.pageY : e.touches[0].pageY;
  const left =
    x - (container.getBoundingClientRect().left + contentWindow.pageXOffset);
  const top =
    y - (container.getBoundingClientRect().top + contentWindow.pageYOffset);

  if (direction === "vertical") {
    let a;
    if (top < 0) {
      a = 0;
    } else if (top > containerHeight) {
      a = 1;
    } else {
      a = Math.round((top * 100) / containerHeight) / 100;
    }

    if (hsl.a !== a) {
      return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a,
        source: "rgb"
      };
    }
  } else {
    let a;
    if (left < 0) {
      a = 0;
    } else if (left > containerWidth) {
      a = 1;
    } else {
      a = Math.round((left * 100) / containerWidth) / 100;
    }

    if (a !== a) {
      return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a,
        source: "rgb"
      };
    }
  }
  return null;
};
