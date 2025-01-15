import { parseStrict } from "fp-utilities";
import { checkValue, checkValue2 } from "visual/utils/checkValue";
import { mPipe, pipe } from "visual/utils/fp";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import { MValue, onNullish } from "visual/utils/value";
import {
  BackgroundValue,
  Direction,
  FlipboxType,
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

const backgroundValueReader = (prefix: "back" | "") =>
  parseStrict<Value, BackgroundValue>({
    bg: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bg")), Str.read),
      onNullish("")
    ),
    bgImageSrc: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgImageSrc")), Str.read),
      onNullish("")
    ),
    bgImageExtension: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgImageExtension")), Str.read),
      onNullish("")
    ),
    bgPopulation: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgPopulation")), Str.read),
      onNullish("")
    ),
    bgImageFileName: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgImageFileName")), Str.read),
      onNullish("")
    ),
    bgSizeType: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgSizeType")), Str.read),
      onNullish("")
    ),
    bgImageWidth: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgImageWidth")), Num.read),
      onNullish(0)
    ),
    bgImageHeight: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgImageHeight")), Num.read),
      onNullish(0)
    ),
    bgPositionX: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgPositionX")), Num.read),
      onNullish(50)
    ),
    bgPositionY: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgPositionY")), Num.read),
      onNullish(50)
    ),
    bgColorType: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgColorType")), Str.read),
      onNullish("")
    ),
    bgColorOpacity: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgColorOpacity")), Num.read),
      onNullish(1)
    ),
    bgColorHex: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgColorHex")), Str.read),
      onNullish("")
    ),
    bgColorPalette: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "bgColorPalette")), Str.read),
      onNullish("")
    ),
    gradientColorHex: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "gradientColorHex")), Str.read),
      onNullish("")
    ),
    gradientColorOpacity: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "gradientColorOpacity")), Num.read),
      onNullish(0)
    ),
    gradientColorPalette: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "gradientColorPalette")), Str.read),
      onNullish("")
    ),
    gradientType: pipe(
      mPipe(Obj.readKey(capByPrefix(prefix, "gradientType")), Str.read),
      onNullish("")
    )
  });

export const getBackgroundValue = (
  type: FlipboxType,
  v: Value
): BackgroundValue => {
  switch (type) {
    case "front":
      return backgroundValueReader("")(v);
    case "back":
      return backgroundValueReader("back")(v);
  }
};
