import { z } from "zod";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontFamilyPropertyDefinition,
  fontFamilySchema,
  fontFamilyTypePropertyDefinition,
  fontStyleEnum,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const paypalPropsSchema = z.object({
  // content
  text: z.string().optional(),
  type: z.enum(["_xclick", "_donations", "_xclick-subscriptions"]).optional(),
  iconType: z.enum(["glyph", "outline", "fa"]).optional(),
  iconName: z.string().optional(),
  account: z.string().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  currency: z
    .enum([
      "AUD",
      "BRL",
      "CAD",
      "CNY",
      "CZK",
      "DKK",
      "EUR",
      "HKD",
      "HUF",
      "ILS",
      "MYR",
      "MXN",
      "TWD",
      "NZD",
      "NOK",
      "PHP",
      "PLN",
      "GBP",
      "RUB",
      "SGD",
      "SEK",
      "CHF",
      "THB",
      "USD"
    ])
    .optional(),
  amount: z.number().min(0).optional(),
  donationAmount: z.enum(["fixed", "anyAmount"]).optional(),
  redirect: z.string().optional(),
  quantity: z.number().min(1).optional(),
  rate: z.number().min(0).optional(),
  activeSandbox: onOff.optional(),
  price: z.number().min(0).optional(),
  tax: z.enum(["none", "percentage"]).optional(),
  openInNewTab: onOff.optional(),
  shippingPrice: z.number().min(0).optional(),
  billingCycle: z.enum(["D", "W", "M", "Y"]).optional(),
  billingCycleDuration: z.number().min(1).optional(),
  autoRenewal: onOff.optional(),

  // style - layout
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  width: z.number().min(0).max(1000).optional(),
  widthSuffix: z.enum(["px", "%"]).optional(),
  height: z.number().min(0).max(500).optional(),
  heightSuffix: z.enum(["px", "%"]).optional(),
  hoverTransition: z.number().min(0).max(100).optional(),

  // style - icon
  iconColorHex: hexColor,
  iconColorOpacity: opacity,
  iconColorPalette: colorPalette,
  iconSize: z.enum(["small", "medium", "large", "custom"]).optional(),
  iconCustomSize: z.number().min(1).max(100).optional(),
  iconCustomSizeSuffix: z.enum(["px"]).optional(),
  iconPosition: z.enum(["left", "right"]).optional(),
  iconSpacing: z.number().min(0).max(100).optional(),
  iconSpacingSuffix: z.enum(["px"]).optional(),

  // style - typography
  typographyFontFamily: fontFamilySchema,
  typographyFontFamilyType: z.enum(["google", "upload", "system"]).optional(),
  typographyFontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  typographyFontSize: z.number().min(8).max(200).optional(),
  typographyFontSizeSuffix: z.enum(["px"]).optional(),
  typographyFontWeight: z.number().min(100).max(900).optional(),
  typographyLineHeight: z.number().min(0.5).max(5).optional(),
  typographyLetterSpacing: z.number().optional(),

  // style - colors
  colorHex: hexColor,
  colorOpacity: opacity,
  colorPalette: colorPalette,
  bgColorType: z.enum(["solid", "gradient"]).optional(),
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidthType: z.enum(["grouped", "ungrouped"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderTopWidth: z.number().min(0).optional(),
  borderRightWidth: z.number().min(0).optional(),
  borderBottomWidth: z.number().min(0).optional(),
  borderLeftWidth: z.number().min(0).optional(),
  borderRadiusType: z.enum(["grouped", "ungrouped"]).optional(),
  borderRadius: z.number().min(0).optional(),
  borderTopLeftRadius: z.number().min(0).optional(),
  borderTopRightRadius: z.number().min(0).optional(),
  borderBottomRightRadius: z.number().min(0).optional(),
  borderBottomLeftRadius: z.number().min(0).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,

  // Hover state: Paypal applies border only on :hover; style2 reads hoverBorder* keys
  hoverBorderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  hoverBorderWidthType: z.enum(["grouped", "ungrouped"]).optional(),
  hoverBorderWidth: z.number().min(0).optional(),
  hoverBorderTopWidth: z.number().min(0).optional(),
  hoverBorderRightWidth: z.number().min(0).optional(),
  hoverBorderBottomWidth: z.number().min(0).optional(),
  hoverBorderLeftWidth: z.number().min(0).optional(),
  hoverBorderColorHex: hexColor,
  hoverBorderColorOpacity: opacity,
  hoverBorderColorPalette: colorPalette,

  boxShadow: z.enum(["", "on"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),
  gradientType: z.enum(["linear", "radial"]).optional(),
  gradientActivePointer: z.enum(["startPointer", "finishPointer"]).optional(),
  gradientStartPointer: z.number().min(0).max(100).optional(),
  gradientFinishPointer: z.number().min(0).max(100).optional(),
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientColorPalette: colorPalette,
  gradientLinearDegree: z.number().min(0).max(360).optional(),
  gradientRadialDegree: z.number().min(0).max(360).optional(),

  // style - padding
  paddingType: z.enum(["grouped", "ungrouped"]).optional(),
  padding: z.number().min(0).optional(),
  paddingTop: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional(),
  paddingSuffix: z.enum(["px"]).optional(),
  paddingTopSuffix: z.enum(["px"]).optional(),
  paddingRightSuffix: z.enum(["px"]).optional(),
  paddingBottomSuffix: z.enum(["px"]).optional(),
  paddingLeftSuffix: z.enum(["px"]).optional()
});

export type PaypalProps = z.infer<typeof paypalPropsSchema>;

type Props = Record<string, unknown>;

const inferBorderWidthType = <T extends Props>(props: T): T => {
  const hasUngrouped =
    ("borderTopWidth" in props && props.borderTopWidth !== undefined) ||
    ("borderRightWidth" in props && props.borderRightWidth !== undefined) ||
    ("borderBottomWidth" in props && props.borderBottomWidth !== undefined) ||
    ("borderLeftWidth" in props && props.borderLeftWidth !== undefined);

  if (hasUngrouped && !("borderWidthType" in props)) {
    return { ...props, borderWidthType: "ungrouped" };
  }
  if (
    "borderWidth" in props &&
    props.borderWidth !== undefined &&
    !("borderWidthType" in props)
  ) {
    return { ...props, borderWidthType: "grouped" };
  }
  return props;
};

const inferBorderStyle = <T extends Props>(props: T): T => {
  const hasBorderWidth =
    ("borderWidth" in props && props.borderWidth !== undefined) ||
    ("borderTopWidth" in props && props.borderTopWidth !== undefined) ||
    ("borderRightWidth" in props && props.borderRightWidth !== undefined) ||
    ("borderBottomWidth" in props && props.borderBottomWidth !== undefined) ||
    ("borderLeftWidth" in props && props.borderLeftWidth !== undefined);

  const hasBorderColor =
    ("borderColorHex" in props && props.borderColorHex !== undefined) ||
    ("borderColorPalette" in props && props.borderColorPalette !== undefined);

  // If border is being configured but style isn't specified, default to solid.
  return (hasBorderWidth || hasBorderColor) && !("borderStyle" in props)
    ? { ...props, borderStyle: "solid" }
    : props;
};

const inferBorderRadiusType = <T extends Props>(props: T): T => {
  const hasUngrouped =
    ("borderTopLeftRadius" in props &&
      props.borderTopLeftRadius !== undefined) ||
    ("borderTopRightRadius" in props &&
      props.borderTopRightRadius !== undefined) ||
    ("borderBottomRightRadius" in props &&
      props.borderBottomRightRadius !== undefined) ||
    ("borderBottomLeftRadius" in props &&
      props.borderBottomLeftRadius !== undefined);

  if (hasUngrouped && !("borderRadiusType" in props)) {
    return { ...props, borderRadiusType: "ungrouped" };
  }
  if (
    "borderRadius" in props &&
    props.borderRadius !== undefined &&
    !("borderRadiusType" in props)
  ) {
    return { ...props, borderRadiusType: "grouped" };
  }
  return props;
};

const inferBoxShadowEnabled = <T extends Props>(props: T): T => {
  const hasBoxShadowFields = [
    "boxShadowColorHex",
    "boxShadowColorOpacity",
    "boxShadowColorPalette",
    "boxShadowBlur",
    "boxShadowSpread",
    "boxShadowVertical",
    "boxShadowHorizontal"
  ].some((k) => k in props && props[k] !== undefined);

  return hasBoxShadowFields && !("boxShadow" in props)
    ? { ...props, boxShadow: "on" }
    : props;
};

const inferPaddingType = <T extends Props>(props: T): T => {
  const hasUngrouped =
    ("paddingTop" in props && props.paddingTop !== undefined) ||
    ("paddingRight" in props && props.paddingRight !== undefined) ||
    ("paddingBottom" in props && props.paddingBottom !== undefined) ||
    ("paddingLeft" in props && props.paddingLeft !== undefined);

  if (hasUngrouped && !("paddingType" in props)) {
    return { ...props, paddingType: "ungrouped" };
  }
  if (
    "padding" in props &&
    props.padding !== undefined &&
    !("paddingType" in props)
  ) {
    return { ...props, paddingType: "grouped" };
  }
  return props;
};

const inferSizeSuffixes = <T extends Props>(props: T): T => {
  const next = { ...props } as Record<string, unknown>;

  if ("width" in next && next.width !== undefined && !("widthSuffix" in next)) {
    next.widthSuffix = "px";
  }
  if (
    "height" in next &&
    next.height !== undefined &&
    !("heightSuffix" in next)
  ) {
    next.heightSuffix = "px";
  }
  if (
    (("padding" in next && next.padding !== undefined) ||
      ("paddingTop" in next && next.paddingTop !== undefined) ||
      ("paddingRight" in next && next.paddingRight !== undefined) ||
      ("paddingBottom" in next && next.paddingBottom !== undefined) ||
      ("paddingLeft" in next && next.paddingLeft !== undefined)) &&
    !("paddingSuffix" in next)
  ) {
    next.paddingSuffix = "px";
    next.paddingTopSuffix ??= "px";
    next.paddingRightSuffix ??= "px";
    next.paddingBottomSuffix ??= "px";
    next.paddingLeftSuffix ??= "px";
  }

  return next as T;
};

/** Border/boxShadow/color are applied only on :hover in Paypal; style2 reads hover* keys. */
const mirrorBorderToHover = <T extends Props>(props: T): T => {
  const borderToHover: Array<[string, string]> = [
    ["borderStyle", "hoverBorderStyle"],
    ["borderWidthType", "hoverBorderWidthType"],
    ["borderWidth", "hoverBorderWidth"],
    ["borderTopWidth", "hoverBorderTopWidth"],
    ["borderRightWidth", "hoverBorderRightWidth"],
    ["borderBottomWidth", "hoverBorderBottomWidth"],
    ["borderLeftWidth", "hoverBorderLeftWidth"],
    ["borderColorHex", "hoverBorderColorHex"],
    ["borderColorOpacity", "hoverBorderColorOpacity"],
    ["borderColorPalette", "hoverBorderColorPalette"]
  ];
  let next = props as Record<string, unknown>;
  for (const [borderKey, hoverKey] of borderToHover) {
    if (
      borderKey in next &&
      next[borderKey] !== undefined &&
      !(hoverKey in next)
    ) {
      next = { ...next, [hoverKey]: next[borderKey] };
    }
  }
  return next as T;
};

/** When border color is set, ensure opacity is visible (default is 0 in Paypal). */
const inferBorderColorOpacity = <T extends Props>(props: T): T => {
  const hasBorderColor =
    ("borderColorHex" in props && props.borderColorHex !== undefined) ||
    ("borderColorPalette" in props && props.borderColorPalette !== undefined);
  if (hasBorderColor && !("borderColorOpacity" in props)) {
    return { ...props, borderColorOpacity: 1 };
  }
  return props;
};

const withTypographyFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "typography");

export const withPaypalDefaults = pipe(
  withColorDefaults,
  withTypographyFontFamily,
  inferBorderWidthType,
  inferBorderStyle,
  inferBorderColorOpacity,
  inferBorderRadiusType,
  inferBoxShadowEnabled,
  inferPaddingType,
  inferSizeSuffixes,
  mirrorBorderToHover
);

const paypalPropertyDefinitions = {
  // content
  text: {
    type: "string",
    description: "Button label text (e.g., 'Pay with PayPal', 'Donate')"
  },
  type: {
    type: "string",
    enum: ["_xclick", "_donations", "_xclick-subscriptions"],
    description:
      "Payment type: '_xclick' = Buy Now / Checkout, '_donations' = Donate, '_xclick-subscriptions' = Subscribe"
  },
  account: {
    type: "string",
    description: "PayPal account email address"
  },
  name: {
    type: "string",
    description: "Item name shown in PayPal"
  },
  sku: {
    type: "string",
    description: "Item SKU / product ID"
  },
  currency: {
    type: "string",
    enum: [
      "AUD",
      "BRL",
      "CAD",
      "CNY",
      "CZK",
      "DKK",
      "EUR",
      "HKD",
      "HUF",
      "ILS",
      "MYR",
      "MXN",
      "TWD",
      "NZD",
      "NOK",
      "PHP",
      "PLN",
      "GBP",
      "RUB",
      "SGD",
      "SEK",
      "CHF",
      "THB",
      "USD"
    ],
    description: "Currency code (e.g., USD, EUR)"
  },
  amount: {
    type: "number",
    description: "Fixed donation amount (when donationAmount is 'fixed')",
    minimum: 0
  },
  donationAmount: {
    type: "string",
    enum: ["fixed", "anyAmount"],
    description:
      "Donation amount mode: 'fixed' uses the amount field, 'anyAmount' lets the donor choose"
  },
  price: {
    type: "number",
    description: "Price for checkout / buy now (type '_xclick')",
    minimum: 0
  },
  quantity: {
    type: "number",
    description: "Item quantity (checkout only)",
    minimum: 1
  },
  shippingPrice: {
    type: "number",
    description: "Shipping cost added to the order (checkout only)",
    minimum: 0
  },
  tax: {
    type: "string",
    enum: ["none", "percentage"],
    description: "Tax mode: 'none' or 'percentage' (checkout only)"
  },
  rate: {
    type: "number",
    description: "Tax percentage (0-100, only when tax is 'percentage')",
    minimum: 0,
    maximum: 100
  },
  redirect: {
    type: "string",
    description:
      "URL to redirect to after a successful payment (e.g., 'https://example.com/thank-you')"
  },
  billingCycle: {
    type: "string",
    enum: ["D", "W", "M", "Y"],
    description:
      "Subscription billing interval: D=Daily, W=Weekly, M=Monthly, Y=Yearly"
  },
  billingCycleDuration: {
    type: "number",
    description:
      "Number of billing cycle units (e.g., 2 with W = every 2 weeks)",
    minimum: 1
  },
  autoRenewal: {
    type: "string",
    enum: ["on", "off"],
    description: "Auto-renew the subscription when 'on'"
  },
  activeSandbox: {
    type: "string",
    enum: ["on", "off"],
    description: "Use PayPal sandbox for testing when 'on'"
  },
  openInNewTab: {
    type: "string",
    enum: ["on", "off"],
    description: "Open PayPal in new tab when 'on'"
  },
  // style
  horizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description: "Horizontal alignment of the button"
  },
  width: {
    type: "number",
    description: "Button width in pixels",
    minimum: 0,
    maximum: 1000
  },
  height: {
    type: "number",
    description: "Button height in pixels",
    minimum: 0,
    maximum: 500
  },
  typographyFontFamily: fontFamilyPropertyDefinition,
  typographyFontFamilyType: fontFamilyTypePropertyDefinition,
  typographyFontStyle: {
    type: "string",
    enum: [
      "",
      "paragraph",
      "subtitle",
      "abovetitle",
      "heading1",
      "heading2",
      "heading3",
      "heading4",
      "heading5",
      "heading6",
      "button"
    ],
    description: "Typography preset. Use '' for custom typography."
  },
  typographyFontSize: {
    type: "number",
    description: "Font size in pixels",
    minimum: 8,
    maximum: 200
  },
  typographyFontWeight: {
    type: "number",
    description: "Font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  colorHex: {
    type: "string",
    description:
      "Text/icon color hex (e.g., '#FFFFFF'). Set colorPalette to '' when using hex."
  },
  colorPalette: {
    type: "string",
    description: "Palette color key (color1-color8) or '' for custom hex"
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#064BD3'). Set bgColorPalette to '' when using hex."
  },
  bgColorPalette: {
    type: "string",
    description: "Background palette key or '' for custom hex"
  },
  iconColorHex: {
    type: "string",
    description: "Icon color hex. Set iconColorPalette to '' when using hex."
  },
  iconColorPalette: {
    type: "string",
    description: "Icon palette key or '' for custom hex"
  },
  iconSize: {
    type: "string",
    enum: ["small", "medium", "large", "custom"],
    description: "Icon size preset"
  },
  iconPosition: {
    type: "string",
    enum: ["left", "right"],
    description: "Icon position relative to text"
  },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border style"
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },
  borderRadius: {
    type: "number",
    description: "Border radius in pixels",
    minimum: 0
  },
  paddingTop: {
    type: "number",
    description: "Padding top in pixels",
    minimum: 0
  },
  paddingRight: {
    type: "number",
    description: "Padding right in pixels",
    minimum: 0
  },
  paddingBottom: {
    type: "number",
    description: "Padding bottom in pixels",
    minimum: 0
  },
  paddingLeft: {
    type: "number",
    description: "Padding left in pixels",
    minimum: 0
  }
} as const;

export const addPaypalDefinition: ToolDefinition = {
  name: "addPaypal",
  strict: true,
  description:
    "Add a PayPal button (checkout, donation, or subscription) to an EXISTING Section or Column. Configure payment type, amount/price, currency, and button style.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...paypalPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updatePaypalDefinition: ToolDefinition = {
  name: "updatePaypal",
  strict: true,
  description:
    "Update a PayPal element's content (text, type, currency, price, amount) or style (colors, typography, size, border). Use searchElements({ type: 'Paypal' }) to find element IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the PayPal element to update"
      },
      ...paypalPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addPaypalConfig: AddToolConfig = {
  kind: "add",
  definition: addPaypalDefinition,
  elementType: ElementTypes.Paypal,
  schema: paypalPropsSchema,
  defaults: withPaypalDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addPaypal input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = withPaypalDefaults(props);
    const parsed = paypalPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Paypal,
      insertIndex: insertIndex as number | undefined,
      initialProperties: parsed.data
    });
    log.tools("addPaypal output %o", result);
    return result;
  }
};

export const updatePaypalConfig: UpdateToolConfig = {
  kind: "update",
  definition: updatePaypalDefinition,
  elementType: ElementTypes.Paypal,
  schema: paypalPropsSchema,
  defaults: withPaypalDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updatePaypal input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withPaypalDefaults(props);
    const parsed = paypalPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.Paypal,
      changes: parsed.data
    });
    log.tools("updatePaypal output %o", result);
    return result;
  }
};
