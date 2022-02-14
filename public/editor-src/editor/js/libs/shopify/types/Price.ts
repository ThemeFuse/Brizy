declare const _price: unique symbol;
export type Price = number & { [_price]: "Price" };
