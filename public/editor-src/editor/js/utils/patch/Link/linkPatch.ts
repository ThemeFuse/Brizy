import { mPipe } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { prop } from "visual/utils/object/get";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { read } from "visual/utils/string/specs";

export interface LinkDCPatch {
  linkPopulation: string;
}

interface FromLinkElementModel extends ElementModel {
  linkPopulation: unknown | undefined;
}

export const fromLinkElementModel = readWithParser<
  FromLinkElementModel,
  LinkDCPatch
>({
  linkPopulation: mPipe(prop("linkPopulation"), read)
});
