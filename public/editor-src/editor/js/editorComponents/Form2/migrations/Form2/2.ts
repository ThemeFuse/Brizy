import { Obj } from "@brizy/readers";
import type { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Deps, Migration } from "visual/utils/migration";
import type { Value } from "../../types";

export const buttonsValueToMigrate = {
  size: "custom",
  paddingRL: 100,
  paddingRLSuffix: "%",
  tabletPaddingRLSuffix: "px",
  mobilePaddingRLSuffix: "px"
};

const migrateMultiStepButtons = (v: Value): Value => {
  const { multistep, items } = v;

  if (multistep && multistep === "on") {
    const newItems = items.map((item: ElementModelType2) => {
      if (item.type === ElementTypes.Button) {
        return {
          ...item,
          value: {
            ...item.value,
            ...buttonsValueToMigrate
          }
        };
      }

      return item;
    });

    return {
      ...v,
      items: newItems
    };
  }

  return v;
};

export const m2: Migration<Deps<unknown>> = {
  version: 2,
  cb({ v }) {
    if (!Obj.isObject(v)) {
      throw new Error(`Form2 multistep buttons migration failed ${v}`);
    }

    return {
      ...v,
      ...migrateMultiStepButtons(v as Value)
    };
  }
};
