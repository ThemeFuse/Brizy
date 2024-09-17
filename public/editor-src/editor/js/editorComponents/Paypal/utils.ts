import { checkValue2 } from "visual/utils/checkValue";
import { BillingCycle } from "./types";

export const getSubscriptionRange = (billingCycle: BillingCycle): number => {
  switch (billingCycle) {
    case BillingCycle.D:
      return 90;
    case BillingCycle.W:
      return 52;
    case BillingCycle.M:
      return 12;
    case BillingCycle.Y:
      return 5;
  }
};

export const parseBillingCycleDuration =
  checkValue2<BillingCycle>(BillingCycle);
