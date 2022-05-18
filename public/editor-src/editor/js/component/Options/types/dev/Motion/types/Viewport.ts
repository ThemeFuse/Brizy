import * as Unit from "visual/utils/math/Unit";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { ElementModel } from "visual/component/Elements/Types";
import { or, parseStrict } from "fp-utilities";

/**
 * Make value constructor private
 */
enum viewport {
  type = "viewport"
}

export interface Viewport {
  type: viewport.type;
  bottom: Unit.Unit;
  top: Unit.Unit;
}

export const unsafe = (top: Unit.Unit, bottom: Unit.Unit): Viewport => ({
  type: viewport.type,
  bottom,
  top
});

export const construct = (
  top: Unit.Unit,
  bottom: Unit.Unit
): Viewport | undefined => (bottom >= top ? unsafe(top, bottom) : undefined);

export const fromElementModel = parseStrict<FromElementModelGetter, Viewport>({
  type: () => viewport.type,
  bottom: or(mPipe(callGetter("bottom"), Num.read, Unit.fromNumber), () => 1),
  top: or(mPipe(callGetter("top"), Num.read, Unit.fromNumber), () => 0)
});

export const toElementModel = (v: Viewport): ElementModel => ({ ...v });
