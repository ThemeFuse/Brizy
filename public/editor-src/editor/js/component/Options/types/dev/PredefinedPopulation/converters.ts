import { mPipe, optional, parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { fromString } from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";
import { read as readLiteral } from "visual/utils/types/Literal";
import { Value } from "../../common/Population/types/Value";

export const defaultValue: Value = {
  population: undefined,
  populationEntityType: undefined,
  populationEntityId: undefined
};

export const fromElementModel: FromElementModel<"predefinedPopulation-dev"> =
  parseStrict<FromElementModelGetter, Value>({
    population: optional(mPipe(callGetter("population"), Str.read, fromString)),
    populationEntityType: optional(
      mPipe(callGetter("populationEntityType"), Str.read, fromString)
    ),
    populationEntityId: optional(
      mPipe(callGetter("populationEntityId"), readLiteral)
    )
  });

export const toElementModel: ToElementModel<"predefinedPopulation-dev"> = (
  value
) => value;
