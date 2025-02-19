import type { ElementModel } from "visual/component/Elements/Types";

type Switch = "on" | "off";

export enum Currency {
  AUD = "AUD",
  BRL = "BRL",
  CAD = "CAD",
  CNY = "CNY",
  CZK = "CZK",
  DKK = "DKK",
  EUR = "EUR",
  HKD = "HKD",
  HUF = "HUF",
  ILS = "ILS",
  MYR = "MYR",
  MXN = "MXN",
  TWD = "TWD",
  NZD = "NZD",
  NOK = "NOK",
  PHP = "PHP",
  PLN = "PLN",
  GBP = "GBP",
  RUB = "RUB",
  SGD = "SGD",
  SEK = "SEK",
  CHF = "CHF",
  THB = "THB",
  USD = "USD"
}

export enum PaypalPaymenType {
  checkout = "_xclick",
  donation = "_donations",
  subscribe = "_xclick-subscriptions"
}

export enum BillingCycle {
  D = "D",
  W = "W",
  M = "M",
  Y = "Y"
}

export interface Value extends ElementModel {
  iconName: string;
  iconType: string;
  type: PaypalPaymenType;
  price: string;
  autoRenewal: Switch;
  billingCycle: BillingCycle;
  billingCycleDuration: number;
  shippingPrice: string;
  tax: "none" | "percentage";
  rate: string;
  quantity: string;
  donationAmount: "fixed" | "anyAmount";
  amount: number;
  currency: Currency;
  sku: string;
  name: string;
  account: string;
  redirect: string;
  openInNewTab: Switch;
  activeSandbox: Switch;
  customCSS: string;
}
