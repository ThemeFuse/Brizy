import React from "react";
import type { FCC } from "visual/utils/react/types";
import { PaypalPaymenType, Value } from "../types";
import { InputCheckout, Props as CheckoutProps } from "./InputCheckout";
import { InputDonation, Props as DonationProps } from "./InputDonation";
import { InputSubscribe, Props as SubscribeProps } from "./InputSubscribe";

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
