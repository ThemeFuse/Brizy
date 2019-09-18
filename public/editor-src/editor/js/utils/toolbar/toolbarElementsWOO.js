import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementWOOProductPageProductID({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "productID", device, state }),
    label: t("Product ID"),
    devices,
    type: "input",
    placeholder: t("Product ID or SKU"),
    value: {
      value: defaultValueValue({
        v,
        key: "productID",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "productID", device, state })]: value
    })
  };
}

export function toolbarElementWOOCategoriesColumns({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "columns", device, state }),
    devices,
    label: t("Columns"),
    type: "select",
    className: "brz-control__select--small",
    choices: [
      { title: "1", value: 1 },
      { title: "2", value: 2 },
      { title: "3", value: 3 },
      { title: "4", value: 4 },
      { title: "5", value: 5 },
      { title: "6", value: 6 }
    ],
    value: defaultValueValue({
      v,
      key: "columns",
      device,
      state
    })
  };
}

export function toolbarElementWOOCategoriesNumber({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "number", device, state }),
    devices,
    label: t("Categories Count"),
    type: "input",
    inputSize: "small",
    value: {
      value: defaultValueValue({
        v,
        key: "number",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "number", device, state })]: value
    })
  };
}

export function toolbarElementWOOCategoriesOrderBy({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "orderBy", device, state }),
    devices,
    label: t("Filter By"),
    type: "select",
    choices: [
      { title: t("Name"), value: "name" },
      { title: t("Slug"), value: "slug" },
      { title: t("Description"), value: "description" },
      { title: t("Count"), value: "count" }
    ],
    value: defaultValueValue({
      v,
      key: "orderBy",
      device,
      state
    })
  };
}

export function toolbarElementWOOCategoriesOrder({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    type: "multiPicker",
    picker: {
      id: defaultValueKey({ key: "order", device, state }),
      devices,
      label: t("Order"),
      type: "radioGroup",
      choices: [
        {
          value: "ASC",
          icon: "nc-up"
        },
        {
          value: "DESC",
          icon: "nc-down"
        }
      ],
      value: defaultValueValue({
        v,
        key: "order",
        device,
        state
      })
    }
  };
}
export function toolbarElementWOOPagesShortCode({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "shortcode", device, state }),
    devices,
    label: t("Page"),
    type: "select",
    choices: [
      { title: t("Cart"), value: "woocommerce_cart" },
      { title: t("Checkout"), value: "woocommerce_checkout" },
      { title: t("My Account"), value: "woocommerce_my_account" },
      { title: t("Order Tracking"), value: "woocommerce_order_tracking" }
    ],
    value: defaultValueValue({
      v,
      key: "shortcode",
      device,
      state
    })
  };
}

export function toolbarElementWOOAddToCartProductID({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "productID", device, state }),
    label: t("Product"),
    devices,
    type: "input",
    placeholder: t("Product ID or SKU"),
    value: {
      value: defaultValueValue({
        v,
        key: "productID",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "productID", device, state })]: value
    })
  };
}

export function toolbarElementWOOAddToCartStyle({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "style", device, state }),
    label: t("Style"),
    type: "input",
    placeholder: t("Style Add to Cart"),
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "style",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "style", device, state })]: value
    })
  };
}
