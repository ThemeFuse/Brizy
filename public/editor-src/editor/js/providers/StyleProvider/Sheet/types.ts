export interface CSSSheet {
  node?: Element;
  className: string;
  cssText: string;
}

interface Data {
  node?: Element;
  className: string;
  cssText: string;
}

export interface CSSOrdered {
  default: Array<Data>;
  rules: Array<Data>;
  custom: Array<Data>;
  symbol: Array<Data>;
}
