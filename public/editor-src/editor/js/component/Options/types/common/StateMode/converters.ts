import { mPipe } from "fp-utilities";
import {
  FromElementModel,
  SimpleValue,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import * as State from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { onNullish } from "visual/utils/value";

export const defaultValue: SimpleValue<State.State> = {
  value: State.empty
};

export const fromElementModel: FromElementModel<"stateMode"> = pipe(
  callGetter("value"),
  Str.read,
  mPipe(State.fromString),
  onNullish(State.empty as State.State),
  (value) => ({ value })
);

export const toElementModel: ToElementModel<"stateMode"> = (value) => value;
