import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { VDecoded } from "../types";

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
