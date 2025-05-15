import { Dictionary } from "visual/types/utils";

export interface Sources {
  id: string;
  title: string;
  orderBy: { id: string; title: string }[];
}

interface RefById {
  type: "single" | "multi" | "manual";
  id: string;
  fieldId: string;
  title: string;
}

export interface CollectionTypesInfo {
  collectionTypesInfo: {
    sources: Sources[];
    refsById: Dictionary<RefById[]>;
  };
}
