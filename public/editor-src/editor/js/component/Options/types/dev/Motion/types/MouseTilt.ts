import * as Unit from "visual/utils/math/Unit";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { mPipe, pass } from "visual/utils/fp";
import { ElementModel } from "visual/component/Elements/Types";
import { elementModelToSpeed } from "./utils";
import { or, parseStrict } from "fp-utilities";

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
