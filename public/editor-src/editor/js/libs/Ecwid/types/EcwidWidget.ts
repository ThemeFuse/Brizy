import { EcwidCategoryId, EcwidProductId } from "visual/global/Ecwid/types";
import { EcwidPageSlug } from "visual/libs/Ecwid";
import { EcwidCartCheckoutStep } from "../../../editorComponents/Ecwid/EcwidCart/types/Value";

export interface Base<T extends EcwidPageSlug, P extends {}> {
  type: T;
  id: string;
  args: P;
  onPageLoad?: VoidFunction;
}

// region Products
export type Products = Base<"CATEGORY", { categoryId: EcwidCategoryId }>;

export const products = (
  id: string,
  categoryId: EcwidCategoryId
): Products => ({
  id,
  args: { categoryId },
  type: "CATEGORY"
});
// endregion

// region Product
export type Product = Base<"product", { id: EcwidProductId }>;

export const product = (id: string, productId: EcwidProductId): Product => ({
  id,
  type: "product",
  args: { id: productId }
});
// endregion

// region Cart
export type Cart = Base<EcwidCartCheckoutStep, {}>;

export const cart = (
  id: string,
  step?: EcwidCartCheckoutStep,
  onPageLoad?: VoidFunction
): Cart => ({
  id,
  type: step ?? EcwidCartCheckoutStep.Cart,
  args: {},
  onPageLoad
});
// endregion

// region MyAccount
export type MyAccount = Base<"account", {}>;

export const myAccount = (id: string): MyAccount => ({
  id,
  args: {},
  type: "account"
});
// endregion

type Favorites = Base<"account/favorites", {}>;

export const favorites = (id: string): Favorites => ({
  id,
  args: {},
  type: "account/favorites"
});

export type EcwidWidget = Products | Product | Cart | MyAccount | Favorites;
