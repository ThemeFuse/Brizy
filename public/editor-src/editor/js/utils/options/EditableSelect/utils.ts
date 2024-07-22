import { Choice } from "visual/component/Options/types/dev/EditableSelect/types";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

export const getActive = (choices: Choice[], value: Literal): MValue<Choice> =>
  choices.find((item) => item.value === value);
