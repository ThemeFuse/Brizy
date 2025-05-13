import { Arr, Obj, Str, pipe } from "@brizy/readers";
import { isT, mPipe, parse, pass } from "fp-utilities";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import {
  GroupBase,
  Model
} from "visual/component/Options/types/dev/Addable/types";
import { onNullish } from "visual/utils/value";

export const defaultValue: Model = { value: [] };

export const fromElementModel: FromElementModel<"addable"> = (get) => {
  return {
    value: pipe(
      mPipe(get, Arr.read, Arr.readWithItemReader(itemParser), (arr) =>
        arr.filter(isT)
      ),
      onNullish(defaultValue.value)
    )("value")
  };
};

export const toElementModel: ToElementModel<"addable"> = ({ value }) => {
  return {
    value
  };
};

const itemParser = mPipe(
  pass(Obj.isObject),
  parse<Record<string, unknown>, GroupBase>({
    id: mPipe(Obj.readKey("id"), Str.read),
    title: mPipe(Obj.readKey("title"), Str.read)
  })
);
