import { getStore } from "visual/redux/store";
import { capitalize } from "visual/utils/string";
import * as Num from "visual/utils/math/number";
import { roundTo } from "visual/utils/math";

import {
  RestrictionMapping,
  RestrictionsMapping,
  ValueMapping,
  Restrictions,
  Restriction,
  TransformRestrictions,
  SimpleRestriction,
  TransformValue,
  TransformPatch,
  Meta,
  Aligns,
  DimensionSuffixs,
  DimensionSuffix,
  DimensionSuffixVariants
} from "./types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { MValue } from "visual/utils/value";
import * as Str from "visual/utils/string/specs";

const RESTRICTIONS = {
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

const normalizeKeyForCurrentDeviceMode = (
  key: keyof Restrictions | Aligns | keyof DimensionSuffix
): keyof ValueMapping => {
  const { deviceMode } = getStore().getState().ui;
  const value =
    deviceMode !== "desktop" ? `${deviceMode}${capitalize(key)}` : key;

  return value as keyof ValueMapping;
};

export const transformAlign = (
  meta: Meta,
  alignKey: Aligns
): MValue<string> => {
  const normalizedAlignKey = normalizeKeyForCurrentDeviceMode(alignKey);

  return Str.read(meta[normalizedAlignKey]) || Str.read(meta[alignKey]);
};

export const transformRestrictions: TransformRestrictions = (
  restrictions = {},
  value
) => {
  const deviceMode: ResponsiveMode = getStore().getState().ui.deviceMode;

  const keys = Object.keys(RESTRICTIONS.desktop) as (keyof Restriction)[];
  return keys.reduce((acc, key) => {
    const normalizedKey = normalizeKeyForCurrentDeviceMode(
      key
    ) as keyof Restrictions;

    const keySuffix = `${key}Suffix` as keyof DimensionSuffix;
    const normalizedKeySuffix = normalizeKeyForCurrentDeviceMode(
      keySuffix
    ) as keyof DimensionSuffixs;

    const normalizedValueSuffix = (value[normalizedKeySuffix] ||
      value[keySuffix]) as DimensionSuffixVariants;

    acc[key] = Object.assign(
      {},
      RESTRICTIONS[deviceMode][key][normalizedValueSuffix],
      restrictions?.[normalizedKey]?.[normalizedValueSuffix]
    );
    return acc;
  }, {} as SimpleRestriction);
};

export const transformValue: TransformValue = value => {
  const keys = Object.keys(RESTRICTIONS.desktop) as (keyof Restriction)[];
  return keys.reduce((acc, key) => {
    const normalizedKey = normalizeKeyForCurrentDeviceMode(
      key
    ) as keyof Restrictions;

    const v = Num.read(value[normalizedKey]) ?? Num.read(value[key]);

    if (v !== undefined) {
      acc[key] = Num.read(value[normalizedKey]) ?? Num.read(value[key]);
    }

    return acc;
  }, {} as RestrictionMapping);
};

export const resizerTransformPatch: TransformPatch = (
  patch,
  startValue,
  value
) => {
  const keys = Object.keys(patch) as (keyof Restriction)[];

  return keys.reduce((acc, key) => {
    const normalizedKey = normalizeKeyForCurrentDeviceMode(key);

    const normalizedHeightKey = normalizeKeyForCurrentDeviceMode("height");
    const normalizedHeightSuffixKey = normalizeKeyForCurrentDeviceMode(
      `heightSuffix`
    );

    const normalizedKeySuffix = normalizeKeyForCurrentDeviceMode(
      `${key}Suffix` as keyof DimensionSuffix
    );
    if (value[normalizedKeySuffix] === undefined) {
      console.error(
        `${normalizedKeySuffix} wasn't found in BoxResizer's value`
      );
    }

    acc[normalizedKey] = patch[key];

    const heightSuffixIsPercent =
      value[normalizedHeightSuffixKey] &&
      value[normalizedHeightSuffixKey] === "%";

    const startWidth = startValue.width as number;
    const startHeight = startValue.height as number;

    if (heightSuffixIsPercent && patch.width) {
      // width is changing
      if (keys.length === 1 && key === "width") {
        const newHeight = (startHeight * startWidth) / 100;

        acc[normalizedHeightKey] = roundTo((newHeight / patch.width) * 100, 2);
      } else if (keys.length === 2 && key === "height") {
        const patchHeight = patch.height as number;
        const newHeight = (startWidth / patch.width) * 100;

        acc[normalizedHeightKey] = roundTo((newHeight * patchHeight) / 100, 2);
      }
    }

    return acc;
  }, {} as Partial<RestrictionsMapping>);
};
