import type { ElementModel } from "visual/component/Elements/Types";
import { NumberSpec } from "visual/utils/math/number";
import { StringSpec } from "visual/utils/string/specs";
import type { Literal } from "visual/utils/types/Literal";
import type { Reader } from "visual/utils/types/Type";
import { type MValue, mCompose } from "visual/utils/value";
import type { HAlign } from "./HAlign";
import * as H from "./HAlign";
import type { Position } from "./Position";
import * as P from "./Position";
import type { VAlign } from "./VAlign";
import * as V from "./VAlign";

type Getter<T> = (get: (k: string) => MValue<Literal>) => MValue<T>;
type Setter = (
  set: (k: string, v: number) => ElementModel,
  v: number,
  k: ElementModel
) => ElementModel;
type Unit = "px" | "%";

const readUnit: Reader<Unit> = mCompose(
  (v) => ((v && v === "px") || v === "%" ? v : undefined),
  StringSpec.read
);

export const getPosition: Getter<Position> = (get) =>
  P.read(get("elementPosition"));

export const getHAlign: Getter<HAlign> = (get) =>
  H.read(get("offsetXAlignment"));

export const getVAlign: Getter<VAlign> = (get) =>
  V.read(get("offsetYAlignment"));

export const getHOffset: Getter<number> = (get) =>
  NumberSpec.read(get("offsetX"));

export const setHOffset: Setter = (set, v, m) => ({
  ...m,
  ...set("offsetX", v)
});

export const getHUnit: Getter<Unit> = (get) => readUnit(get("offsetXSuffix"));

export const getVOffset: Getter<number> = (get) =>
  NumberSpec.read(get("offsetY"));

export const setVOffset: Setter = (set, v, m) => ({
  ...m,
  ...set("offsetY", v)
});

export const getVUnit: Getter<Unit> = (get) => readUnit(get("offsetYSuffix"));
