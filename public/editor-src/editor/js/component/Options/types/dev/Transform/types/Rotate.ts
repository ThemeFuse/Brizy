import { or, parseStrict } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import {
  FromElementModelGetter,
  callGetter
} from "visual/component/Options/Type";
import { always, mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Degree from "./utils/Degree";

export interface Rotate {
  degree: Degree.Degree;
}

export const fromElementModel = parseStrict<FromElementModelGetter, Rotate>({
  degree: or(
    mPipe(callGetter("degree"), Num.read, Degree.fromNumber),
    always(0)
  )
});

export const toElementModel = (v: Rotate): ElementModel => ({ ...v });
