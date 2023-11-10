import { ElementModel } from "visual/component/Elements/Types";
import { makePlaceholder } from "visual/utils/dynamicContent";
import * as Str from "visual/utils/string/specs";
import { MValue } from "visual/utils/value";

export interface CssId extends ElementModel {
  customID: unknown;
  cssID: unknown;
  cssIDPopulation: unknown;
}

export const getCSSId = <V extends CssId>(v: V): MValue<string> => {
  const customID = Str.mRead(v.customID) || "";
  const cssIDPopulation = Str.mRead(v.cssIDPopulation) || "";

  if (cssIDPopulation) {
    const cssId = Str.read(v.cssID);

    if (cssId) {
      return cssId;
    }

    return makePlaceholder({
      content: cssIDPopulation,
      attr: {
        entityId: Str.read(v.cssIDPopulationEntityId),
        entityType: Str.read(v.cssIDPopulationEntityType)
      }
    });
  }

  return customID;
};
