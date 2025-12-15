import { Num, Str } from "@brizy/readers";
import { DeviceMode } from "visual/types";
import { roundTo } from "visual/utils/math";
import { capitalize } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import {
  Aligns,
  DimensionSuffix,
  DimensionSuffixVariants,
  DimensionSuffixs,
  Meta,
  Restriction,
  RestrictionMapping,
  Restrictions,
  RestrictionsMapping,
  SimpleRestriction,
  TransformPatch,
  TransformRestrictions,
  TransformStory,
  TransformStoryPatch,
  TransformValue,
  ValueMapping
} from "./types";
import {
  RESTRICTIONS,
  calcOffsetX,
  calcOffsetXBySize,
  calcOffsetY,
  calcOffsetYBySize
} from "./utils";

const normalizeKeyForCurrentDeviceMode = (
  key: keyof Restrictions | Aligns | keyof DimensionSuffix,
  device: DeviceMode
): keyof ValueMapping => {
  const value = device !== "desktop" ? `${device}${capitalize(key)}` : key;

  return value as keyof ValueMapping;
};

export const transformAlign = (
  meta: Meta,
  alignKey: Aligns,
  device: DeviceMode
): MValue<string> => {
  const normalizedAlignKey = normalizeKeyForCurrentDeviceMode(alignKey, device);

  return Str.read(meta[normalizedAlignKey]) || Str.read(meta[alignKey]);
};

export const transformRestrictions: TransformRestrictions = (
  restrictions = {},
  value,
  device
) => {
  const keys = Object.keys(RESTRICTIONS.desktop) as (keyof Restriction)[];
  return keys.reduce((acc, key) => {
    const normalizedKey = normalizeKeyForCurrentDeviceMode(
      key,
      device
    ) as keyof Restrictions;

    const keySuffix = `${key}Suffix` as keyof DimensionSuffix;
    const normalizedKeySuffix = normalizeKeyForCurrentDeviceMode(
      keySuffix,
      device
    ) as keyof DimensionSuffixs;

    const normalizedValueSuffix = (value[normalizedKeySuffix] ||
      value[keySuffix]) as DimensionSuffixVariants;

    acc[key] = Object.assign(
      {},
      RESTRICTIONS[device][key][normalizedValueSuffix],
      restrictions?.[normalizedKey]?.[normalizedValueSuffix]
    );
    return acc;
  }, {} as SimpleRestriction);
};

export const transformValue: TransformValue = (value, device) => {
  const keys = Object.keys(RESTRICTIONS.desktop) as (keyof Restriction)[];
  return keys.reduce((acc, key) => {
    const normalizedKey = normalizeKeyForCurrentDeviceMode(
      key,
      device
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
  value,
  device
) => {
  const keys = Object.keys(patch) as (keyof Restriction)[];

  return keys.reduce((acc, key) => {
    const normalizedKey = normalizeKeyForCurrentDeviceMode(key, device);

    const normalizedHeightKey = normalizeKeyForCurrentDeviceMode(
      "height",
      device
    );
    const normalizedHeightSuffixKey = normalizeKeyForCurrentDeviceMode(
      "heightSuffix",
      device
    );

    const normalizedKeySuffix = normalizeKeyForCurrentDeviceMode(
      `${key}Suffix` as keyof DimensionSuffix,
      device
    );
    const keySuffix = `${key}Suffix` as keyof DimensionSuffix;

    if (
      value[normalizedKeySuffix] === undefined &&
      value[keySuffix] === undefined
    ) {
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

export const resizerTransformStory: TransformStory = (transformV, sourceV) => {
  // there can't be tablet, mobile keys
  return {
    ...transformV,
    offsetX: sourceV.offsetX as number,
    offsetY: sourceV.offsetY as number
  };
};

export const resizerTransformStoryPatch: TransformStoryPatch = (
  patch,
  startValue,
  point,
  startRect
) => {
  let value = {};
  switch (point) {
    case "bottomLeft":
    case "centerLeft": {
      value = {
        offsetX: patch.size
          ? calcOffsetXBySize(startValue, patch)
          : calcOffsetX(startValue, patch)
      };

      break;
    }
    case "topRight":
    case "topCenter": {
      value = {
        offsetY: patch.size
          ? calcOffsetYBySize(startValue, patch, startRect)
          : calcOffsetY(startValue, patch)
      };

      break;
    }

    case "topLeft": {
      value = {
        offsetX: patch.size
          ? calcOffsetXBySize(startValue, patch)
          : calcOffsetX(startValue, patch),
        offsetY: patch.size
          ? calcOffsetYBySize(startValue, patch, startRect)
          : calcOffsetY(startValue, patch)
      };

      break;
    }
  }

  return { ...patch, ...value };
};
