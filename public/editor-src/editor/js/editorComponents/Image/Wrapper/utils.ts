import { SizeRestriction, WidthHeightRestriction } from "./type";
import { Meta } from "../types";

export const getSizeRestriction = (): SizeRestriction => ({
  size: {
    px: {
      min: 5,
      max: 1000
    },
    "%": {
      min: 5,
      max: 100
    }
  },
  tabletSize: {
    px: {
      min: 5,
      max: 1000
    },
    "%": {
      min: 5,
      max: 100
    }
  },
  mobileSize: {
    px: {
      min: 5,
      max: 1000
    },
    "%": {
      min: 5,
      max: 100
    }
  }
});

export const getWidthRestriction = (
  meta: Meta,
  isAbsoluteOrFixed: boolean
): WidthHeightRestriction => ({
  height: {
    px: {
      min: 5,
      max: Infinity
    },
    "%": {
      min: 5,
      max: Infinity
    }
  },
  width: {
    px: {
      min: 5,
      max: meta.desktopW
    },
    "%": {
      min: 5,
      max: isAbsoluteOrFixed ? Infinity : 100
    }
  },
  tabletWidth: {
    px: {
      min: 5,
      max: meta.tabletW
    },
    "%": {
      min: 5,
      max: 100
    }
  },
  mobileWidth: {
    px: {
      min: 5,
      max: meta.mobileW
    },
    "%": {
      min: 5,
      max: 100
    }
  }
});
