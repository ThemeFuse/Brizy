import React from "react";
import type { FCC } from "visual/utils/react/types";
import { PaypalPaymenType, type Value } from "../types";
import { type Props as CheckoutProps, InputCheckout } from "./InputCheckout";
import { type Props as DonationProps, InputDonation } from "./InputDonation";
import { InputSubscribe, type Props as SubscribeProps } from "./InputSubscribe";

type Props = CheckoutProps &
  SubscribeProps &
  DonationProps &
  Pick<Value, "type">;

export const InputsPayment: FCC<Props> = ({
  type,
  price,
  shippingPrice,
  tax,
  quantity,
  billingCycle,
  billingCycleDuration,
  autoRenewal,
  donationAmount
}) => {
  switch (type) {
    case PaypalPaymenType.donation:
      return <InputDonation donationAmount={donationAmount} />;
    case PaypalPaymenType.subscribe:
      return (
        <InputSubscribe
          price={price}
          billingCycle={billingCycle}
          billingCycleDuration={billingCycleDuration}
          autoRenewal={autoRenewal}
        />
      );
    case PaypalPaymenType.checkout:
      return (
        <InputCheckout
          price={price}
          shippingPrice={shippingPrice}
          tax={tax}
          quantity={quantity}
        />
      );
  }
};
