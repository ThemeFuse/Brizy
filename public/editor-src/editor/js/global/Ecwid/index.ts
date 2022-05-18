// region EcwidStoreId
declare const storeId: unique symbol;

export type EcwidStoreId = string & { [storeId]: "EcwidStoreId" };
// endregion

// region EcwidProductId
declare const productId: unique symbol;

export type EcwidProductId = string & { [productId]: "EcwidProductId" };
// endregion

// region EcwidCategoryId
declare const categoryId: unique symbol;

export type EcwidCategoryId = number & { [categoryId]: "EcwidCategoryId" };
// endregion

// region EcwidOrderId
declare const orderId: unique symbol;

export type EcwidOrderId = string & { [orderId]: "EcwidOrderId" };
// endregion
