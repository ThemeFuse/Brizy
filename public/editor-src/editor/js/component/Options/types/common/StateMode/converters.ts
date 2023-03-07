import * as State from "visual/utils/stateMode";
import { pipe } from "visual/utils/fp";
import {
  callGetter,
  FromElementModel,
  SimpleValue,
  ToElementModel
} from "visual/component/Options/Type";
import * as Str from "visual/utils/string/specs";
import { mPipe } from "fp-utilities";
import { onNullish } from "visual/utils/value";

export const defaultValue: SimpleValue<State.State> = {
  value: State.empty
};

export const fromElementModel: FromElementModel<"stateMode-dev"> = pipe(
  callGetter("value"),
  Str.read,
  mPipe(State.fromString),
  onNullish(State.empty as State.State),
  value => ({ value })
);

export const toElementModel: ToElementModel<"stateMode-dev"> = value => value;
