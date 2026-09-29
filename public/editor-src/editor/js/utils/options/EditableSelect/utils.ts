import type { Choice } from "visual/component/Options/types/dev/EditableSelect/types";
import type { Literal } from "visual/utils/types/Literal";
import type { MValue } from "visual/utils/value";

export const getActive = (choices: Choice[], value: Literal): MValue<Choice> =>
  choices.find((item) => item.value === value);
