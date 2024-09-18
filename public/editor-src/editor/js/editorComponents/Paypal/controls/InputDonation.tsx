import React from "react";
import type { FCC } from "visual/utils/react/types";

export interface Props {
  donationAmount: number;
}

export const InputDonation: FCC<Props> = ({ donationAmount }) => (
  <input type="hidden" name="amount" value={donationAmount} />
);
