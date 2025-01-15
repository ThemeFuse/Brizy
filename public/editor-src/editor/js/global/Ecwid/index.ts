import { Num, Str } from "@brizy/readers";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

// region EcwidStoreId
declare const storeId: unique symbol;

export type EcwidStoreId = string & { [storeId]: "EcwidStoreId" };
// endregion

// region EcwidProductId
declare const productId: unique symbol;
declare const productIdWithSlug: unique symbol;

export type EcwidProductId = number & { [productId]: "EcwidProductId" };
export type EcwidProductIdWithSlug = string & {
  [productIdWithSlug]: "EcwidProductIdWithSlug";
};

export const isEcwidProductId = (id: unknown): id is EcwidProductId =>
  !!Num.read(id);

export const isEcwidProductIdWithSlug = (
  id: unknown
): id is EcwidProductIdWithSlug => {
  const _id = Str.read(id);

  if (_id === undefined) {
    return false;
  }

  const regex = /ecwid-product\/\d+$/m;

  return regex.test(_id);
};

export const getEcwidProductIdFromSlug = (
  slugWithId: EcwidProductIdWithSlug
): MValue<EcwidProductId> => {
  const id = Num.read(slugWithId.split("/")[1]);

  if (isEcwidProductId(id)) {
    return id;
  }
};

export const getEcwidProductId = (id: Literal): EcwidProductId => {
  if (isEcwidProductIdWithSlug(id)) {
    const idFromSlug = getEcwidProductIdFromSlug(id);

    if (idFromSlug) {
      return idFromSlug;
    }
  }

  return id as EcwidProductId;
};
// endregion

// region EcwidCategoryId
declare const categoryId: unique symbol;

export type EcwidCategoryId = number & { [categoryId]: "EcwidCategoryId" };
// endregion

// region EcwidOrderId
declare const orderId: unique symbol;

export type EcwidOrderId = string & { [orderId]: "EcwidOrderId" };
// endregion
