//#region EcwidProductId

declare const productId: unique symbol;
declare const productIdWithSlug: unique symbol;

export type EcwidProductId = number & { [productId]: "EcwidProductId" };
export type EcwidProductIdWithSlug = string & {
  [productIdWithSlug]: "EcwidProductIdWithSlug";
};

//#endregion

//#region EcwidCategoryId

declare const categoryId: unique symbol;

export type EcwidCategoryId = number & { [categoryId]: "EcwidCategoryId" };

//#endregion

//#region EcwidOrderId

declare const orderId: unique symbol;

export type EcwidOrderId = string & { [orderId]: "EcwidOrderId" };

//#endregion

// region EcwidStoreId
declare const storeId: unique symbol;

export type EcwidStoreId = string & { [storeId]: "EcwidStoreId" };
// endregion
