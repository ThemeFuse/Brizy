import { or } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { always } from "visual/utils/fp";
import { readSymbols } from "visual/utils/options/Symbols/utils";

export const defaultValue: SimpleValue<string[]> = {
  value: []
};

export const fromElementModel: Option.FromElementModel<"symbols"> = (get) => ({
  value: or(readSymbols, always(defaultValue.value))(get("value"))
});

export const toElementModel: Option.ToElementModel<"symbols"> = (value) => ({
  value: value.value
});
