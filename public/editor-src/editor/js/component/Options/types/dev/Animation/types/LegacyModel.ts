import { ToElementModel } from "visual/component/Options/Type";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import { or, parseStrict } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";
import { call, Get } from "../utils";
import { fromString, LegacyEffectType } from "./LegacyEffectType";

export type LegacyModel = {
  name: LegacyEffectType;
  duration: Positive.Positive;
  delay: Positive.Positive;
  infiniteAnimation: boolean;
};

export const fromElementModel = parseStrict<Get, LegacyModel>({
  name: or<Get, LegacyEffectType>([
    mPipe(call("name"), Str.read, fromString),
    (): LegacyEffectType => LegacyEffectType.none
  ]),
  duration: or<Get, Positive.Positive>([
    mPipe(call("duration"), Num.read, Positive.fromNumber),
    (): Positive.Positive => Positive.Zero
  ]),
  delay: or<Get, Positive.Positive>([
    mPipe(call("delay"), Num.read, Positive.fromNumber),
    (): Positive.Positive => Positive.Zero
  ]),
  infiniteAnimation: or<Get, boolean>([
    mPipe(call("infiniteAnimation"), (v) => Boolean(v)),
    (): boolean => false
  ])
});

export const toElementModel: ToElementModel<LegacyModel> = (v) => {
  return {
    name: v.name,
    duration: v.duration,
    delay: v.delay,
    infiniteAnimation: v.infiniteAnimation
  };
};

export const eq: IsEqual<LegacyModel> = (a, b) =>
  a.name === b.name &&
  a.delay === b.delay &&
  a.duration === b.duration &&
  a.infiniteAnimation === b.infiniteAnimation;
