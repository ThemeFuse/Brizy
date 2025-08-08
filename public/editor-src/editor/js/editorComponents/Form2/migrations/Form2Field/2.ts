import { Arr, Obj } from "@brizy/readers";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Deps, Migration } from "visual/utils/migration";
import { setIds } from "visual/utils/models";
import { Value } from "../../types";
import { Form2FieldOption } from "./type";

// Select, Radio, Checkbox
const migrateFieldOptions = (v: Partial<Value>): Form2FieldOption[] => {
  if (Obj.hasKey("options", v)) {
    const options = Arr.read(v.options) ?? [];

    if (!options.length) {
      return [];
    }

    return options.map((option) => {
      return setIds({
        type: ElementTypes.Form2FieldOption,
        value: { label: option, value: option }
      });
    });
  }

  return [];
};

export const m2: Migration<Deps<unknown>> = {
  version: 2,
  cb(v) {
    if (!Obj.isObject(v)) {
      throw new Error(`Form2 Select, Radio, Checkbox migration failed ${v}`);
    }

    const value: Partial<Value> = {
      ...v,
      multistep: "off",
      items: []
    };

    return {
      ...v,
      items: migrateFieldOptions(value)
    };
  }
};
