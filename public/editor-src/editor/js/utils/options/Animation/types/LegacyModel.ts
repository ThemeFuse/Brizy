import { mPipe, optional, parseStrict } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import * as Positive from "visual/utils/math/Positive";
import * as Num from "visual/utils/math/number";
import { or } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";
import { Get, call } from "../utils";
import { LegacyEffectType, fromString } from "./LegacyEffectType";

export type LegacyModel = {
  name: LegacyEffectType;
  duration: Positive.Positive;
  delay: Positive.Positive;
  infiniteAnimation: boolean;
  timing?: string;
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
  ]),
  timing: optional(mPipe(call("timing"), Str.read))
});

export const toElementModel = (v: LegacyModel): ElementModel => {
  const model: ElementModel = {
    name: v.name,
    duration: v.duration,
    delay: v.delay,
    infiniteAnimation: v.infiniteAnimation
  };
  if (v.timing !== undefined) {
    model.timing = v.timing;
  }
  return model;
};

export const eq: IsEqual<LegacyModel> = (a, b) =>
  a.name === b.name &&
  a.delay === b.delay &&
  a.duration === b.duration &&
  a.infiniteAnimation === b.infiniteAnimation &&
  a.timing === b.timing;
