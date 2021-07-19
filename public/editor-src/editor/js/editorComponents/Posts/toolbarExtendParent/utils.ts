import {
  getCollectionTypesWithFields,
  getCollectionItems
} from "visual/utils/api";
import { isT } from "visual/utils/value";
import { Choice } from "visual/component/Options/types/dev/MultiSelect2/types";
import { Dictionary } from "visual/types/utils";

type GetCollectionTypesInfoResult = {
  collectionTypes: { id: string; slug?: string | null; title: string }[];
  refsById: Dictionary<
    { type: "single" | "multi"; id: string; title: string }[]
  >;
};
export async function getCollectionTypesInfo(): Promise<
  GetCollectionTypesInfoResult
> {
  const r = await getCollectionTypesWithFields();
  const collectionTypes = r.map(({ id, title }) => ({ id, title }));
  const refsById = r.reduce((acc, { id, fields }) => {
    if (fields) {
      const refs = fields
        .map(field => {
          if (field.__typename === "CollectionTypeFieldReference") {
            return {
              type: "single" as const,
              id: field.referenceSettings.collectionType.id,
              title: field.referenceSettings.collectionType.title
            };
          } else if (field.__typename === "CollectionTypeFieldMultiReference") {
            return {
              type: "multi" as const,
              id: field.multiReferenceSettings.collectionType.id,
              title: field.multiReferenceSettings.collectionType.title
            };
          } else {
            return undefined;
          }
        })
        .filter(isT);

      if (refs.length > 0) {
        acc[id] = refs;
      }
    }

    return acc;
  }, {} as GetCollectionTypesInfoResult["refsById"]);

  return {
    collectionTypes,
    refsById
  };
}

export const lvl2MultiSelectLoad = (collectionId: string) => async (
  value: string[]
): Promise<Choice[]> => {
  try {
    const items = await getCollectionItems(collectionId, { include: value });

    return items.map(item => ({
      title: item.title,
      value: item.id
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }

    return [];
  }
};

export const lvl2MultiSelectSearch = (collectionId: string) => async (
  search: string
): Promise<Choice[]> => {
  try {
    const items = await getCollectionItems(collectionId, { search });

    return items.map(({ id, title }) => ({
      title,
      value: id
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }

    return [];
  }
};
