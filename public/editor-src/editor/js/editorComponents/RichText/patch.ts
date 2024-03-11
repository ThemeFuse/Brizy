import * as Obj from "visual/utils/reader/object";
import type { Value } from "./types";

export const dynamicContent = (patch: Partial<Value>) =>
  Obj.hasKeys(
    ["textPopulation", "textPopulationEntityType", "textPopulationEntityId"],
    patch
  );

export const bgDynamicContent = (patch: Partial<Value>) =>
  Obj.hasKeys(
    ["imagePopulation", "imagePopulationEntityId", "imagePopulationEntityType"],
    Obj.read(patch.backgroundImage) ?? {}
  );
