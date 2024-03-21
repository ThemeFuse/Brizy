import { mPipe, or, parseStrict, pass } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { elementModelToSpeed } from "./utils";

export interface MouseTrack {
  direction: "direct" | "opposite";
  speed: Unit.Unit;
}

export const isDirection = (v: unknown): v is MouseTrack["direction"] =>
  v === "direct" || v === "opposite";

export const fromElementModel = parseStrict<FromElementModelGetter, MouseTrack>(
  {
    direction: or(
      mPipe(callGetter("direction"), pass(isDirection)),
      () => "direct"
    ),
    speed: elementModelToSpeed
  }
);

export const toElementModel = (v: MouseTrack): ElementModel => ({ ...v });
