import * as Str from "visual/utils/reader/string";
import { MValue } from "visual/utils/value";
export const readToggle = (v: unknown): MValue<boolean> => {
  if (typeof v === "boolean") {
    return v;
  }

  const valueAsString = Str.read(v);

  switch (valueAsString) {
    case "on":
      return true;
    case "off":
      return false;
  }
};
