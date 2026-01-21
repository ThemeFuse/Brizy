import { ElementModel } from "visual/component/Elements/Types";
import { Deps, Migration } from "visual/utils/migration";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";

// Migrate "sourceType" to "populationEntityType"
const migrateSourceType = (v: ElementModel) => {
  if (Obj.hasKey("sourceType", v)) {
    return Str.read(v.sourceType);
  }
};

// Migrate "sourceID" to "populationEntityId"
const migrateSourceID = (v: ElementModel) => {
  if (Obj.hasKey("sourceID", v)) {
    return Str.read(v.sourceID);
  }
};

export const m2: Migration<Deps<unknown>> = {
  version: 2,
  cb({ v }) {
    if (!Obj.isObject(v)) {
      throw new Error(`PostTitle sourceType && sourceID migration failed ${v}`);
    }

    const entityType = migrateSourceType(v) ?? v.textPopulationEntityType ?? "";
    const entityId = migrateSourceID(v) ?? v.textPopulationEntityId ?? "";

    return {
      ...v,
      textPopulationEntityType: entityType,
      textPopulationEntityId: entityId
    };
  }
};
