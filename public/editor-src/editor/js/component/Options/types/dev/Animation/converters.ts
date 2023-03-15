import * as Option from "visual/component/Options/Type";
import { mPipe, pipe } from "visual/utils/fp";
import { Zero } from "visual/utils/math/Positive";
import { EffectType } from "./types/EffectType";
import * as LegacyModel from "./types/LegacyModel";
import { Value, fromLegacyModel, toLegacyModel } from "./types/Value";

export const defaultValue: Value = {
  type: EffectType.None,
  duration: Zero,
  delay: Zero,
  infiniteAnimation: false
};

export const fromElementModel: Option.FromElementModel<"animation-dev"> = pipe(
  mPipe(LegacyModel.fromElementModel, fromLegacyModel),
  (v) => v ?? { type: EffectType.None }
);

export const toElementModel: Option.ToElementModel<"animation-dev"> = pipe(
  toLegacyModel,
  LegacyModel.toElementModel
);
