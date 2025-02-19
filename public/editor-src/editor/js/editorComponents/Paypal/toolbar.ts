import { Str } from "@brizy/readers";
import type { ElementProps } from "visual/component/Elements/Types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { GetItems } from "../EditorComponent/types";
import { BillingCycle, Currency, PaypalPaymenType, Value } from "./types";
import { getSubscriptionRange, parseBillingCycleDuration } from "./utils";

const rangeConfig = {
  min: 1,
  max: 1000,
  spinner: true
};

const pxUnits = [{ title: "px", value: "px" }];

export const getItems: GetItems<Value, ElementProps> = ({
  v,
  device,
  context
}) => {
  const { tax, donationAmount } = v;

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const type = Str.read(dvv("type")) ?? PaypalPaymenType.checkout;
  const iconIsDisabled = !dvv("iconName");
  const billingCycle =
    parseBillingCycleDuration(Str.read(dvv("billingCycle"))) ?? BillingCycle.D;

  const maxBillingCycleDuration = getSubscriptionRange(billingCycle);

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const isCheckout = type === PaypalPaymenType.checkout;
  const isDonation = type === PaypalPaymenType.donation;
  const isSubscription = type === PaypalPaymenType.subscribe;
  const disableAmount = !isDonation || donationAmount !== "fixed";
  const disableRate = tax === "none" || !isCheckout;

  return [
    {
      id: "toolbarPaypal",
      type: "popover",
      devices: "desktop",
      config: {
        icon: "t2-paypal",
        title: t("Paypal")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementGeneral",
              label: t("Paypal"),
              options: [
                {
                  id: "type",
                  label: t("Type"),
                  type: "select",
                  choices: [
                    { title: t("Checkout"), value: PaypalPaymenType.checkout },
                    { title: t("Donation"), value: PaypalPaymenType.donation },
                    {
                      title: t("Subscription"),
                      value: PaypalPaymenType.subscribe
                    }
                  ]
                },
                {
                  id: "account",
                  label: t("Account"),
                  type: "paypal",
                  helper: {
                    content: t("Please provide a valid PayPal account!")
                  }
                },
                {
                  id: "name",
                  label: t("Name"),
                  type: "inputText",
                  placeholder: t("Enter item Name"),
                  population: richTextDC
                },
                {
                  id: "sku",
                  label: t("SKU"),
                  type: "inputText",
                  placeholder: t("Insert SKU"),
                  population: richTextDC
                },
                {
                  id: "tax",
                  label: t("Tax"),
                  type: "select",
                  disabled: !isCheckout,
                  choices: [
                    { title: t("None"), value: "none" },
                    { title: t("Percentage"), value: "percentage" }
                  ]
                },
                {
                  id: "rate",
                  label: t("Tax Percentage"),
                  type: "number",
                  disabled: disableRate,
                  config: {
                    min: 0,
                    max: 100,
                    spinner: true
                  },
                  population: richTextDC
                },
                {
                  id: "billingCycle",
                  label: t("Billing Cycle"),
                  type: "select",
                  disabled: !isSubscription,
                  choices: [
                    { title: t("Daily"), value: BillingCycle.D },
                    { title: t("Weekly"), value: BillingCycle.W },
                    { title: t("Monthly"), value: BillingCycle.M },
                    { title: t("Yearly"), value: BillingCycle.Y }
                  ]
                },
                {
                  id: "billingCycleDuration",
                  label: t("Billing Cycle Duration"),
                  type: "number",
                  disabled: !isSubscription,
                  config: {
                    ...rangeConfig,
                    max: maxBillingCycleDuration
                  }
                },
                {
                  id: "autoRenewal",
                  label: t("Auto Renewal"),
                  type: "switch",
                  disabled: !isSubscription
                }
              ]
            },
            {
              id: "tabCurrentElementAmount",
              label: t("Amount"),
              options: [
                {
                  id: "currency",
                  label: t("Currency"),
                  type: "select",
                  choices: [
                    { title: t("AUD"), value: Currency.AUD },
                    { title: t("BRL"), value: Currency.BRL },
                    { title: t("CAD"), value: Currency.CAD },
                    { title: t("CNY"), value: Currency.CNY },
                    { title: t("CZK"), value: Currency.CZK },
                    { title: t("DKK"), value: Currency.DKK },
                    { title: t("EUR"), value: Currency.EUR },
                    { title: t("HKD"), value: Currency.HKD },
                    { title: t("HUF"), value: Currency.HUF },
                    { title: t("ILS"), value: Currency.ILS },
                    { title: t("MYR"), value: Currency.MYR },
                    { title: t("MXN"), value: Currency.MXN },
                    { title: t("TWD"), value: Currency.TWD },
                    { title: t("NZD"), value: Currency.NZD },
                    { title: t("NOK"), value: Currency.NOK },
                    { title: t("PHP"), value: Currency.PHP },
                    { title: t("PLN"), value: Currency.PLN },
                    { title: t("GBP"), value: Currency.GBP },
                    { title: t("RUB"), value: Currency.RUB },
                    { title: t("SGD"), value: Currency.SGD },
                    { title: t("SEK"), value: Currency.SEK },
                    { title: t("CHF"), value: Currency.CHF },
                    { title: t("THB"), value: Currency.THB },
                    { title: t("USD"), value: Currency.USD }
                  ]
                },
                {
                  id: "price",
                  label: t("Price"),
                  type: "number",
                  disabled: isDonation,
                  config: rangeConfig,
                  population: richTextDC
                },
                {
                  id: "shippingPrice",
                  label: t("Shipping Price"),
                  type: "number",
                  config: {
                    ...rangeConfig,
                    min: 0
                  },
                  disabled: !isCheckout,
                  population: richTextDC
                },
                {
                  id: "donationAmount",
                  label: t("Donation Amount"),
                  type: "select",
                  disabled: !isDonation,
                  choices: [
                    { title: t("Fixed"), value: "fixed" },
                    { title: t("Any Amount"), value: "anyAmount" }
                  ]
                },
                {
                  id: "quantity",
                  label: t("Quantity"),
                  type: "number",
                  disabled: !isCheckout,
                  config: rangeConfig,
                  population: richTextDC
                },
                {
                  id: "amount",
                  label: t("Amount"),
                  type: "number",
                  disabled: disableAmount,
                  config: {
                    ...rangeConfig,
                    min: 0
                  },
                  population: richTextDC
                }
              ]
            },
            {
              id: "tabSandbox",
              label: t("Sandbox"),
              options: [
                {
                  id: "activeSandbox",
                  label: t("Sandbox"),
                  type: "switch"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarIcon",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 60,
      options: [
        {
          id: "icon",
          label: t("Icon"),
          type: "iconSetter",
          devices: "desktop",
          config: { canDelete: true }
        },
        {
          id: "iconPosition",
          label: t("Position"),
          type: "radioGroup",
          devices: "desktop",
          disabled: iconIsDisabled,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "groupIconSizesPicker",
          disabled: iconIsDisabled,
          type: "group",
          options: [
            {
              id: "iconSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "iconCustomSize",
              type: "slider",
              disabled: dvv("iconSize") !== "custom",
              config: {
                min: 8,
                max: 50,
                units: pxUnits
              }
            }
          ]
        },
        {
          id: "iconSpacing",
          label: t("Spacing"),
          type: "slider",
          disabled: iconIsDisabled,
          config: {
            min: 0,
            max: 100,
            units: pxUnits
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
              options: [
                {
                  id: "typography",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: "auto",
              align: "center",
              options: [
                {
                  id: "text",
                  devices: "desktop",
                  type: "population",
                  config: richTextDC
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      position: 80,
      options: [
        {
          id: "tabsToolbarColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  config: {
                    opacity: true
                  }
                }
              ]
            },
            {
              id: "colorTab",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "BorderTab",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      devices: "desktop",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      position: 90,
      options: [
        {
          id: "tabsLink",
          type: "tabs",
          tabs: [
            {
              id: "paypalLinkTab",
              label: t("Link"),
              options: [
                {
                  id: "openInNewTab",
                  label: t("Open Paypal in new Tab"),
                  type: "switch"
                }
              ]
            },
            {
              id: "redirectTab",
              label: t("Redirect"),
              options: [
                {
                  id: "redirect",
                  label: t("Go to"),
                  type: "inputText",
                  placeholder: "http://",
                  helper: {
                    content: t("Redirect after successful payment!")
                  },
                  population: richTextDC
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 10,
            max: dvv("widthSuffix") === "px" ? 400 : 100,
            units: [{ value: "%", title: "%" }, ...pxUnits]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: 15,
            max: 300,
            units: pxUnits
          }
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    }
  ];
};
