import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { getCollectionTypesWithFields } from "visual/utils/api/cms";
import { isT } from "visual/utils/value";
import { Context, VDecoded } from "../types";

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

export const useAsSimpleSelectConditions = (vd: VDecoded): boolean => {
  const { source, symbols } = vd;
  const lvl1SymbolId = `${source}_incBy`;

  return (
    (source === ShopifyTemplate.Product &&
      !symbols[lvl1SymbolId]?.includes("manual")) ||
    source === ShopifyTemplate.Article
  );
};
