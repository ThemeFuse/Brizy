import type { Value } from "visual/editorComponents/Audio/types";

export const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

export function getResizerRestrictions(v: Value) {
  return {
    height: {
      px: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      "%": {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      }
    },
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
    tabletHeight: {
      px: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      "%": {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      }
    },
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
    mobileHeight: {
      px: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      "%": {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      }
    },
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
  };
}
