import { mPipe, optional, parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/common/Population/types/Value";
import { callGetter } from "visual/utils/options/utils/wrap";
import { fromString } from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";
import { read as readLiteral } from "visual/utils/types/Literal";

export const defaultValue: Value = {
  population: undefined,
  populationEntityType: undefined,
  populationEntityId: undefined
};

export const fromElementModel: FromElementModel<"predefinedPopulation"> =
  parseStrict<FromElementModelGetter, Value>({
    population: optional(mPipe(callGetter("population"), Str.read, fromString)),
    populationEntityType: optional(
      mPipe(callGetter("populationEntityType"), Str.read, fromString)
    ),
    populationEntityId: optional(
      mPipe(callGetter("populationEntityId"), readLiteral)
    )
  });

export const toElementModel: ToElementModel<"predefinedPopulation"> = (value) =>
  value;
