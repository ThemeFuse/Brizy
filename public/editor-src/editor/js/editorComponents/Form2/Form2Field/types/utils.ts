import { setIds } from "visual/utils/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const createNewFieldOption = (value: string) =>
  setIds({
    type: ElementTypes.Form2FieldOption,
    value: {
      label: value,
      value
    }
  });
