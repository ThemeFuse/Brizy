import {
  EcwidCategoryId,
  EcwidOrderId,
  EcwidProductId
} from "../../../global/Ecwid/types";

interface Base<T extends string> {
  type: T;
  hasPrevious: boolean;
}

export interface Account extends Base<"ACCOUNT_ROOT"> {
  changeEmail: boolean;
}

export interface Product extends Base<"PRODUCT"> {
  categoryId: number;
  entryPage: boolean;
  forceScroll: boolean;
  mainCategoryId: number;
  name: string;
  productId: EcwidProductId;
}

export interface Category extends Base<"CATEGORY"> {
  categoryId: EcwidCategoryId;
  entryPage: boolean;
  name: string;
  offset: number;
  rootParameter: boolean;
  type: "CATEGORY";
}

export interface Search extends Base<"SEARCH"> {
  keywords: string;
  offset: number;
  sort: "normal" | "relevance";
  type: "SEARCH";
  withSubcategory: boolean;
  facetSearch: boolean;
}

export interface SignIn extends Base<"SIGN_IN"> {
  returnUrl?: string;
}

export type Cart = Base<"CART">;
export type CheckoutShipping = Base<"CHECKOUT_ADDRESS">;
export type CheckoutPayment = Base<"CHECKOUT_PAYMENT_DETAILS">;
export interface CheckoutOrderConfirmation extends Base<"ORDER_CONFIRMATION"> {
  orderId: EcwidOrderId;
}
export interface AccountFavorites extends Base<"FAVORITES"> {
  forceShow: boolean;
  offset: number;
}
export type AccountAddressBook = Base<"ADDRESS_BOOK">;

export interface PagesAbout extends Base<"TERMS"> {
  page: "about";
}

export interface PagesShippingPayment extends Base<"TERMS"> {
  page: "shipping-payment";
}

export interface PagesReturns extends Base<"TERMS"> {
  page: "returns";
}

export interface PagesTerms extends Base<"TERMS"> {
  page: "terms";
}

export interface PagesPrivacyPolicy extends Base<"TERMS"> {
  page: "privacy-policy";
}

export type PageType =
  | Account
  | AccountAddressBook
  | AccountFavorites
  | Cart
  | Category
  | CheckoutOrderConfirmation
  | CheckoutPayment
  | CheckoutShipping
  | PagesAbout
  | PagesShippingPayment
  | PagesReturns
  | PagesTerms
  | PagesPrivacyPolicy
  | Product
  | Search
  | SignIn;
