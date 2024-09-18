import { Point, Restrictions } from "visual/component/BoxResizer/types";

export const formatNumber = (n: number, separator: string): string =>
  n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

export const getBoxResizerParams = (): {
  points: Point[];
  restrictions: Partial<Restrictions>;
} => ({
  points: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
  restrictions: {
    size: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    },
    tabletSize: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    },
    mobileSize: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    }
  }
});
