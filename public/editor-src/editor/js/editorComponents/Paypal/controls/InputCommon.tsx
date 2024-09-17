import React from "react";
import type { FCC } from "visual/utils/react/types";
import type { Currency, PaypalPaymenType } from "../types";

export interface Props {
  type: PaypalPaymenType;
  account: string;
  name: string;
  sku: string;
  currency: Currency;
  redirect: string;
}

export const InputCommon: FCC<Props> = ({
  type,
  account,
  name,
  sku,
  currency,
  redirect
}) => (
  <>
    <input type="hidden" name="cmd" value={type} />
    <input type="hidden" name="business" value={account} />
    <input type="hidden" name="item_name" value={name} />
    <input type="hidden" name="item_number" value={sku} />
    <input type="hidden" name="currency_code" value={currency} />
    <input type="hidden" name="return" value={redirect} />
    <input type="hidden" name="no_note" value="1" />
  </>
);
