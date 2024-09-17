import React from "react";
import type { FCC } from "visual/utils/react/types";
import type { BillingCycle } from "../types";

export interface Props {
  price: string;
  autoRenewal: 0 | 1;
  billingCycle: BillingCycle;
  billingCycleDuration: number;
}

export const InputSubscribe: FCC<Props> = ({
  price,
  autoRenewal,
  billingCycle,
  billingCycleDuration
}) => (
  <>
    <input type="hidden" name="a3" value={price} />
    <input type="hidden" name="src" value={autoRenewal} />
    <input type="hidden" name="t3" value={billingCycle} />
    <input type="hidden" name="p3" value={billingCycleDuration} />
    <input type="hidden" name="no_shipping" value="1" />
  </>
);
