import { Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import * as State from "visual/component/Prompts/common/states/Classic/types/State";

export type Reducer<
  Invalid extends State.St,
  Valid extends Invalid,
  A extends { type: string }
> = (
  s: State.State<Invalid, Valid>,
  a: Actions<Invalid> | A
) => State.State<Invalid, Valid>;
