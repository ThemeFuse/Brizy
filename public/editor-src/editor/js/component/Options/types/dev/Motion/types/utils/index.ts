import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { capByPrefix } from "visual/utils/string";
import { mPipe, or } from "fp-utilities";
import * as Num from "visual/utils/math/number";
import * as Unit from "visual/utils/math/Unit";
import { pipe } from "visual/utils/fp";
import * as Viewport from "visual/component/Options/types/dev/Motion/types/Viewport";

export const wrap = (prefix: string) => (
  f: FromElementModelGetter
): FromElementModelGetter => (s): ReturnType<FromElementModelGetter> =>
  f(capByPrefix(prefix, s));

export const elementModelToSpeed = or(
  mPipe(callGetter("speed"), Num.read, Unit.fromNumber),
  (): Unit.Unit => 0
);
export const elementModelToLevel = or(
  mPipe(callGetter("level"), Num.read, Unit.fromNumber),
  (): Unit.Unit => 0
);

export const elementModelToViewport = pipe(
  wrap("viewport"),
  Viewport.fromElementModel
);
