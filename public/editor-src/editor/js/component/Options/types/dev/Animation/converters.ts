import { EffectType } from "./types/EffectType";
import * as Option from "visual/component/Options/Type";
import { Value, fromLegacyModel, toLegacyModel } from "./types/Value";
import * as LegacyModel from "./types/LegacyModel";
import { mPipe, pipe } from "visual/utils/fp";

export const fromElementModel: Option.FromElementModel<Value> = pipe(
  mPipe(LegacyModel.fromElementModel, fromLegacyModel),
  v => v ?? { type: EffectType.None }
);

export const toElementModel: Option.ToElementModel<Value> = pipe(
  toLegacyModel,
  LegacyModel.toElementModel
);
