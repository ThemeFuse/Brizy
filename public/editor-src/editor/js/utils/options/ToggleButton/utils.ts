import * as Str from "visual/utils/reader/string";
import { MValue } from "visual/utils/value";
import { Toggle } from "visual/utils/options/utils/Type";

export const readToggle = (v: unknown): MValue<boolean> => {
  if (typeof v === "boolean") {
    return v;
  }

  const valueAsString = Str.read(v);

  switch (valueAsString) {
    case Toggle.ON:
      return true;
    case Toggle.OFF:
      return false;
  }
};
