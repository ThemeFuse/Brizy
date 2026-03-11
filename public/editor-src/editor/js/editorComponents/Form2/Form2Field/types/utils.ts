import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { setIds } from "visual/utils/models";

export const createNewFieldOption = (value: string) =>
  setIds({
    type: ElementTypes.Form2FieldOption,
    value: {
      label: value,
      value
    }
  });
