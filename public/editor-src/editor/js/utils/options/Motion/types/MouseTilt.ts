import { or, parseStrict } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { mPipe, pass } from "visual/utils/fp";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { elementModelToSpeed } from "./utils";

export interface MouseTilt {
  direction: "direct" | "opposite";
  speed: Unit.Unit;
}

export const isDirection = (v: unknown): v is MouseTilt["direction"] =>
  v === "direct" || v === "opposite";

export const fromElementModel = parseStrict<FromElementModelGetter, MouseTilt>({
  direction: or(
    mPipe(callGetter("direction"), pass(isDirection)),
    () => "direct"
  ),
  speed: elementModelToSpeed
});

export const toElementModel = (v: MouseTilt): ElementModel => ({ ...v });
