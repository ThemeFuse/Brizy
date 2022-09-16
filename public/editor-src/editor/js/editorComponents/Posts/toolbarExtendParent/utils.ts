import {
  Choice,
  Value
} from "visual/component/Options/types/dev/MultiSelect2/types";
import {
  getCollectionItems,
  getCollectionTypesWithFields
} from "visual/utils/api/cms";
import { isT } from "visual/utils/value";
import { Context } from "../types";

type GetCollectionTypesInfoResult = Context["collectionTypesInfo"];

export async function getCollectionTypesInfo(): Promise<GetCollectionTypesInfoResult> {
  const r = await getCollectionTypesWithFields();
  const collectionTypes = r.map(({ id, title }) => ({ id, title }));
  const refsById = r.reduce((acc, { id, fields }) => {
    if (fields) {
      const refs = fields
        .map((field) => {
          if (field.__typename === "CollectionTypeFieldReference") {
            return {
              type: "single" as const,
              id: field.referenceSettings.collectionType.id,
              fieldId: field.id,
              title: field.label
            };
          } else if (field.__typename === "CollectionTypeFieldMultiReference") {
            return {
              type: "multi" as const,
              id: field.multiReferenceSettings.collectionType.id,
              fieldId: field.id,
              title: field.label
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

export const createFieldCollectionId = (
  collectionId: string,
  fieldId?: string
): string => {
  return fieldId ? `${collectionId}:${fieldId}` : collectionId;
};

export const getFieldIdCollectionId = (
  s: string
): { collectionId: string; fieldId?: string } => {
  const [collectionId, fieldId] = s.split(":");

  return fieldId ? { collectionId, fieldId } : { collectionId };
};

export const lvl2MultiSelectLoad =
  (collectionId: string, fieldId?: string) =>
  async (value: Value): Promise<Choice[]> => {
    try {
      const include = value.map(
        (v) => getFieldIdCollectionId(`${v}`).collectionId
      );
      const items = await getCollectionItems(collectionId, { include });

      return items.map(({ title, id }) => ({
        title,
        value: createFieldCollectionId(id, fieldId)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }

      return [];
    }
  };

export const lvl2MultiSelectSearch =
  (collectionId: string, fieldId?: string) =>
  async (search: string): Promise<Choice[]> => {
    try {
      const items = await getCollectionItems(collectionId, { search });

      return items.map(({ id, title }) => ({
        title,
        value: createFieldCollectionId(id, fieldId)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }

      return [];
    }
  };
