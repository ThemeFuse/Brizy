import { match2, or } from "fp-utilities";
import { Palette } from "visual/utils/color/Palette";
import { match } from "visual/utils/fp/match";
import { t } from "visual/utils/i18n";
import { is } from "visual/utils/value";
import {
  Value,
  fromEmpty,
  fromNoEmpty,
  isEmpty,
  isNoEmpty
} from "./types/Value";

export const getPalette: (v: Value) => Palette | undefined = match(
  [isEmpty, (): Palette | undefined => undefined],
  [isNoEmpty, (v): Palette | undefined => v.palette]
);

export type SelectType = "none" | "shadow";

export const getOptions = (): Array<{ id: SelectType; title: string }> => [
  { id: "none", title: t("None") },
  { id: "shadow", title: t("Shadow") }
];

export const selectTypeFromValue: (v: Value) => SelectType = match(
  [isEmpty, () => "none"],
  [isNoEmpty, () => "shadow"]
);

export const valueFromSelectType = or<SelectType, Value, Value, Value>(
  match2(
    [is("shadow" as const), isEmpty, (_, v) => fromEmpty(v)],
    [is("none" as const), isNoEmpty, (_, v) => fromNoEmpty(v)]
  ),
  (_, v) => v
);
