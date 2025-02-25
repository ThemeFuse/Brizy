import { Num, Obj, Str } from "@brizy/readers";
import { parseStrict } from "fp-utilities";
import { checkValue, checkValue2 } from "visual/utils/checkValue";
import { mPipe, pipe } from "visual/utils/fp";
import { DESKTOP } from "visual/utils/responsiveMode";
import { camelCase, capByPrefix } from "visual/utils/string";
import { Literal } from "visual/utils/types/Literal";
import { MValue, onNullish } from "visual/utils/value";
import {
  BackgroundValue,
  BackgroundValueGetter,
  Direction,
  GetBackgroundValue,
  Transition,
  Trigger,
  Value
} from "./types";

export const getHeight = (
  node: HTMLElement,
  settings?: { resetTransition: boolean; resetTransform: boolean }
): number => {
  const { resetTransition, resetTransform } = settings ?? {};

  if (resetTransition) {
    node.classList.add("brz-transition--none");
  }
  if (resetTransform) {
    node.classList.add("brz-transform--none");
  }
  node.style.height = "auto";

  const height = node.getBoundingClientRect().height;

  if (resetTransition) {
    node.classList.remove("brz-transition--none");
  }
  if (resetTransform) {
    node.classList.remove("brz-transform--none");
  }
  node.style.removeProperty("height");

  return height;
};

export const readTransition = (v: unknown): MValue<Transition> =>
  checkValue<Transition>([
    "flip",
    "slide",
    "push",
    "zoomIn",
    "zoomOut",
    "fade"
  ])(v);

export const readDirection = (v: unknown): MValue<Direction> =>
  checkValue<Direction>(["left", "right", "up", "down"])(v);

export const readTrigger = checkValue2(Trigger);

const backgroundValueReader = (
  prefix: "back" | "",
  device: "" | "tablet" | "mobile"
) =>
  parseStrict<Value, Record<string, Literal>>({
    [capByPrefix(device, "bg")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bg"])), Str.read),
      onNullish("")
    ),
    [capByPrefix(device, "bgImageSrc")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgImageSrc"])), Str.read),
      onNullish("")
    ),
    [capByPrefix(device, "bgImageExtension")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "bgImageExtension"])),
        Str.read
      ),
      onNullish("")
    ),
    [capByPrefix(device, "bgPopulation")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgPopulation"])), Str.read),
      onNullish("")
    ),
    [capByPrefix(device, "bgImageFileName")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "bgImageFileName"])),
        Str.read
      ),
      onNullish("")
    ),
    [capByPrefix(device, "bgSizeType")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgSizeType"])), Str.read),
      onNullish("")
    ),
    [capByPrefix(device, "bgImageWidth")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgImageWidth"])), Num.read),
      onNullish(0)
    ),
    [capByPrefix(device, "bgImageHeight")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "bgImageHeight"])),
        Num.read
      ),
      onNullish(0)
    ),
    [capByPrefix(device, "bgPositionX")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgPositionX"])), Num.read),
      onNullish(50)
    ),
    [capByPrefix(device, "bgPositionY")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgPositionY"])), Num.read),
      onNullish(50)
    ),
    [capByPrefix(device, "bgColorType")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgColorType"])), Str.read),
      onNullish("")
    ),
    [capByPrefix(device, "bgColorOpacity")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "bgColorOpacity"])),
        Num.read
      ),
      onNullish(1)
    ),
    [capByPrefix(device, "bgColorHex")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "bgColorHex"])), Str.read),
      onNullish("")
    ),
    [capByPrefix(device, "bgColorPalette")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "bgColorPalette"])),
        Str.read
      ),
      onNullish("")
    ),
    [capByPrefix(device, "gradientColorHex")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "gradientColorHex"])),
        Str.read
      ),
      onNullish("")
    ),
    [capByPrefix(device, "gradientColorOpacity")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "gradientColorOpacity"])),
        Num.read
      ),
      onNullish(0)
    ),
    [capByPrefix(device, "gradientColorPalette")]: pipe(
      mPipe(
        Obj.readKey(camelCase([device, prefix, "gradientColorPalette"])),
        Str.read
      ),
      onNullish("")
    ),
    [capByPrefix(device, "gradientType")]: pipe(
      mPipe(Obj.readKey(camelCase([device, prefix, "gradientType"])), Str.read),
      onNullish("")
    )
  });

const bgKeys: Array<keyof BackgroundValue> = [
  "bg",
  "tabletBg",
  "mobileBg",
  "bgImageSrc",
  "tabletBgImageSrc",
  "mobileBgImageSrc",
  "bgImageExtension",
  "tabletBgImageExtension",
  "mobileBgImageExtension",
  "bgPopulation",
  "tabletBgPopulation",
  "mobileBgPopulation",
  "bgImageFileName",
  "tabletBgImageFileName",
  "mobileBgImageFileName",
  "bgSizeType",
  "tabletBgSizeType",
  "mobileBgSizeType",
  "bgImageWidth",
  "tabletBgImageWidth",
  "mobileBgImageWidth",
  "bgImageHeight",
  "tabletBgImageHeight",
  "mobileBgImageHeight",
  "bgPositionX",
  "tabletBgPositionX",
  "mobileBgPositionX",
  "bgPositionY",
  "tabletBgPositionY",
  "mobileBgPositionY",
  "bgColorType",
  "tabletBgColorType",
  "mobileBgColorType",
  "bgColorOpacity",
  "tabletBgColorOpacity",
  "mobileBgColorOpacity",
  "bgColorHex",
  "tabletBgColorHex",
  "mobileBgColorHex",
  "bgColorPalette",
  "tabletBgColorPalette",
  "mobileBgColorPalette",
  "gradientColorHex",
  "tabletGradientColorHex",
  "mobileGradientColorHex",
  "gradientColorOpacity",
  "tabletGradientColorOpacity",
  "mobileGradientColorOpacity",
  "gradientColorPalette",
  "tabletGradientColorPalette",
  "mobileGradientColorPalette",
  "gradientType",
  "tabletGradientType",
  "mobileGradientType"
];

const getBackgroundValue: GetBackgroundValue = ({ type, v, device }) => {
  const _device = device === DESKTOP ? "" : device;

  let value = undefined;

  switch (type) {
    case "front":
      value = backgroundValueReader("", _device)(v);
      break;
    case "back":
      value = backgroundValueReader("back", _device)(v);
      break;
  }

  if (value) {
    const isValid = Object.keys(value).every((k) =>
      bgKeys.includes(k as keyof BackgroundValue)
    );

    if (isValid) {
      return value as unknown as BackgroundValue;
    }
  }
};

export const backgroundValueGetter: BackgroundValueGetter =
  ({ type, v }) =>
  (device) =>
    getBackgroundValue({ type, v, device });
