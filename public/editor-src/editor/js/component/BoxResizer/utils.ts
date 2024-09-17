import { DH, DW } from "visual/editorComponents/Story/utils";
import { roundTo } from "visual/utils/math";

export const calcRectangleSide = (
  value: number,
  asValue: number,
  delta: number
): number => (delta * value) / asValue;

export const calcRectangleSize = (
  value: number,
  width: number,
  height: number,
  delta: { dx: number; dy: number }
): number => {
  const { dx, dy } = delta;
  const ratioX = dx / width;
  const ratioY = dy / height;

  return ratioX < ratioY ? (dx / width) * value : (dy / height) * value;
};

export const calcMaxHeightBasedOnWidth = (
  widthMax: number,
  rectWidth: number,
  rectHeight: number,
  valueWidth: number,
  valueHeight: number
): number => {
  const maxRectWidth = (widthMax * rectWidth) / valueWidth;

  const maxRectHeight = (rectHeight * maxRectWidth) / rectWidth;

  return (maxRectHeight * valueHeight) / rectHeight;
};

type StartValue = {
  size?: number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
};
type Patch = {
  size?: number;
  width?: number;
  height?: number;
};

export const calcOffsetX = (startValue: StartValue, patch: Patch): number => {
  const patchW = patch.width as number;
  const startValueW = startValue.width as number;

  return roundTo((startValue.offsetX as number) - (patchW - startValueW), 2);
};

export const calcOffsetY = (startValue: StartValue, patch: Patch): number => {
  // it's needed for cases only when height was changes
  // topCenter pointer was moved as example
  const width = patch.width || startValue.width;

  const elemWidthInPx = ((width as number) * DW) / 100;
  const elemHeightInPx = ((patch.height as number) * elemWidthInPx) / 100;

  const elemStartWidthInPx = ((startValue.width as number) * DW) / 100;
  const elemStartHeightInPx =
    ((startValue.height as number) * elemStartWidthInPx) / 100;

  const offsetDiffInPx = elemStartHeightInPx - elemHeightInPx;
  return (
    (startValue.offsetY as number) + roundTo((offsetDiffInPx * 100) / DH, 2)
  );
};

export const calcOffsetXBySize = (
  startValue: StartValue,
  patch: Patch
): number => {
  const patchS = patch.size as number;
  const startValueS = startValue.size as number;

  return roundTo((startValue.offsetX as number) - (patchS - startValueS), 2);
};

export const calcOffsetYBySize = (
  startValue: StartValue,
  patch: Patch,
  startRect: DOMRect
): number => {
  const patchS = patch.size as number;
  const startValueS = startValue.size as number;

  const heightInPx = (patchS * startRect.height) / startValueS;

  const startHeight = (startRect.height * 100) / DH;
  const heightDiff = (heightInPx * 100) / DH;

  return roundTo(
    (startValue.offsetY as number) + (startHeight - heightDiff),
    2
  );
};

export const RESTRICTIONS = {
  desktop: {
    height: {
      px: {
        min: 3,
        max: Infinity
      },
      "%": {
        min: 3,
        max: Infinity
      }
    },
    size: {
      px: {
        min: 3,
        max: 100
      },
      "%": {
        min: 3,
        max: 100
      }
    },
    width: {
      px: {
        min: 3,
        max: 100
      },
      "%": {
        min: 3,
        max: 100
      }
    }
  },

  tablet: {
    // Tablet
    height: {
      px: {
        min: 3,
        max: Infinity
      },
      "%": {
        min: 3,
        max: Infinity
      }
    },
    size: {
      px: {
        min: 3,
        max: 100
      },
      "%": {
        min: 3,
        max: 100
      }
    },
    width: {
      px: {
        min: 3,
        max: 100
      },
      "%": {
        min: 3,
        max: 100
      }
    }
  },

  mobile: {
    // Mobile
    height: {
      px: {
        min: 3,
        max: Infinity
      },
      "%": {
        min: 3,
        max: Infinity
      }
    },
    size: {
      px: {
        min: 3,
        max: 100
      },
      "%": {
        min: 3,
        max: 100
      }
    },
    width: {
      px: {
        min: 3,
        max: 100
      },
      "%": {
        min: 3,
        max: 100
      }
    }
  }
};
