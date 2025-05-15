import type { Point, Restrictions } from "visual/component/BoxResizer/types";
import { MValue } from "visual/utils/value";
import { Animate, ProgressStyle } from "./types";

export const readType = (v: unknown): MValue<ProgressStyle> => {
  switch (v) {
    case ProgressStyle.Style1:
    case ProgressStyle.Style2:
      return v;
  }
};

export const getBoxResizerParams = (): {
  points: Point[];
  restrictions: Partial<Restrictions>;
} => ({
  points: ["centerLeft", "centerRight"],
  restrictions: {
    width: {
      px: {
        min: 5,
        max: 1000
      },
      "%": {
        min: 5,
        max: 100
      }
    },
    // Tablet
    tabletWidth: {
      px: {
        min: 5,
        max: 1000
      },
      "%": {
        min: 5,
        max: 100
      }
    },
    // Mobile
    mobileWidth: {
      px: {
        min: 5,
        max: 1000
      },
      "%": {
        min: 5,
        max: 100
      }
    }
  }
});

export const animate: Animate = ({ text, wrapper, value, type }) => {
  let width = 0;
  const translateValue =
    document.dir === "rtl" ? value : Math.max(-value, -100);

  const interval = setInterval(() => {
    if (width >= value) {
      clearInterval(interval);
    } else {
      width++;
      if (wrapper) {
        wrapper.style.maxWidth = width + 0.5 + "%";
      }
      if (text) {
        text.innerHTML = width + "%";
        if (type === "style2") {
          text.style.marginInlineStart = `clamp(0%, ${
            Math.round(width + 0.5) + "%"
          }, 100%)`;
          text.style.transform = `translateX(${translateValue}%)`;
        }
      }
    }
  }, 1500 / value);
};
