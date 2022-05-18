import * as Positive from "visual/utils/math/Positive";
import { mPipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import { or, parseStrict } from "visual/utils/reader/readWithParser";
import { call, Get } from "../utils";
import { LegacyEffectType, fromString } from "./LegacyEffectType";
import { ToElementModel } from "visual/component/Options/Type";
import { IsEqual } from "visual/utils/types/Eq";

export type LegacyModel = {
  name: LegacyEffectType;
  duration: Positive.Positive;
  delay: Positive.Positive;
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
  ])
});

export const toElementModel: ToElementModel<LegacyModel> = v => {
  return {
    name: v.name,
    duration: v.duration,
    delay: v.delay
  };
};

export const eq: IsEqual<LegacyModel> = (a, b) =>
  a.name === b.name && a.delay === b.delay && a.duration === b.duration;
