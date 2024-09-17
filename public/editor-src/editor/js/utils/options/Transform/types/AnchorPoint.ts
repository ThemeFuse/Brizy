import { or, parseStrict, pass } from "fp-utilities";
import { AnchorPoint } from "visual/component/Controls/Transform/types/AnchorPoint";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { always, mPipe } from "visual/utils/fp";
import { callGetter } from "visual/utils/options/utils/wrap";

export const isX = (v: unknown): v is AnchorPoint["x"] =>
  ["left", "center", "right"].includes(v as AnchorPoint["x"]);

export const isY = (v: unknown): v is AnchorPoint["y"] =>
  ["top", "center", "bottom"].includes(v as AnchorPoint["y"]);

export const fromElementModel = parseStrict<
  FromElementModelGetter,
  AnchorPoint
>({
  x: or(mPipe(callGetter("x"), pass(isX)), always("center")),
  y: or(mPipe(callGetter("y"), pass(isY)), always("center"))
});
