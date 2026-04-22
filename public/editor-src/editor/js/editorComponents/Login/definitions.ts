import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { ElementDetails, ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";

const contentSchema = z.object({
  type: z.enum(["login", "register", "forgot", "authorized"]).optional(),
  defaultRoles: z.string().optional(),

  showPlaceholder: onOff.optional(),
  showLabel: onOff.optional(),
  remember: onOff.optional(),
  showRegisterLink: onOff.optional(),
  showLoginLink: onOff.optional(),
  showLostPassword: onOff.optional(),
  showAgreeTerms: onOff.optional(),
  termsAgreementLabel: z.string().optional(),
  enableCustomHtml: onOff.optional(),
  customHtml: z.string().optional(),

  showName: onOff.optional(),
  showFirstName: onOff.optional(),
  showLastName: onOff.optional(),
  showUsername: onOff.optional(),
  showPhoneNumber: onOff.optional(),
  showRegisterInfo: onOff.optional(),

  lostPassword: z.string().optional(),
  registerLink: z.string().optional(),
  loginLink: z.string().optional(),

  redirectType: z.enum(["samePage", "custom"]).optional(),
  messageRedirect: z.string().optional(),
  logoutRedirectType: z.enum(["samePage", "custom"]).optional(),
  logoutRedirect: z.string().optional(),

  emptyFieldsError: z.string().optional(),
  passLengthError: z.string().optional(),
  passMatchError: z.string().optional()
});

const styleSchema = z.object({
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  fontSize: z.number().min(8).max(200).optional(),
  fontSizeSuffix: z.enum(["px", "em"]).optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  letterSpacing: z.number().optional(),
  colorHex: hexColor,
  colorOpacity: opacity,
  colorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,
  hoverBgColorHex: hexColor,
  hoverBgColorOpacity: opacity,
  hoverBgColorPalette: colorPalette,
  textColorHex: hexColor,
  textColorOpacity: opacity,
  textColorPalette: colorPalette,
  linkColorHex: hexColor,
  linkColorOpacity: opacity,
  linkColorPalette: colorPalette,
  lostColorHex: hexColor,
  lostColorOpacity: opacity,
  lostColorPalette: colorPalette,
  registerInfoColorHex: hexColor,
  registerInfoColorOpacity: opacity,
  registerInfoColorPalette: colorPalette,
  registerLinkColorHex: hexColor,
  registerLinkColorOpacity: opacity,
  registerLinkColorPalette: colorPalette,
  loginLinkColorHex: hexColor,
  loginLinkColorOpacity: opacity,
  loginLinkColorPalette: colorPalette,
  agreementColorHex: hexColor,
  agreementColorOpacity: opacity,
  agreementColorPalette: colorPalette,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderRadius: z.number().min(0).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,
  padding: z.number().min(0).optional(),
  fieldPadding: z.number().min(0).max(100).optional(),
  boxShadow: z.enum(["none", "on"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional()
});

export const loginPropsSchema = contentSchema.merge(styleSchema);
export type LoginProps = z.infer<typeof loginPropsSchema>;

/** When LLM sets bgColor hex without opacity, default opacity to 1 so the color is visible. */
function withLoginBgOpacityDefaults<T extends Record<string, unknown>>(
  props: T
): T {
  const p = { ...props } as Record<string, unknown>;
  if (p.bgColorHex !== undefined && p.bgColorOpacity === undefined) {
    p.bgColorOpacity = 1;
  }
  if (p.hoverBgColorHex !== undefined && p.hoverBgColorOpacity === undefined) {
    p.hoverBgColorOpacity = 1;
  }
  return p as T;
}

/** When LLM sets boxShadow props (blur, color, etc.) without boxShadow, set boxShadow to "on" so the shadow applies. */
function withLoginBoxShadowDefaults<T extends Record<string, unknown>>(
  props: T
): T {
  const p = { ...props } as Record<string, unknown>;
  if (p.boxShadow !== undefined) return p as T;
  const hasShadowProps =
    p.boxShadowBlur !== undefined ||
    p.boxShadowSpread !== undefined ||
    p.boxShadowVertical !== undefined ||
    p.boxShadowHorizontal !== undefined ||
    p.boxShadowColorHex !== undefined;
  if (hasShadowProps) {
    p.boxShadow = "on";
  }
  return p as T;
}

export const withLoginDefaults = (props: Record<string, unknown>) =>
  withLoginBgOpacityDefaults(
    withLoginBoxShadowDefaults(withColorDefaults(props))
  );

const LOGIN_CONTENT_KEYS = new Set([
  "type",
  "defaultRoles",
  "showPlaceholder",
  "showLabel",
  "remember",
  "showRegisterLink",
  "showLoginLink",
  "showLostPassword",
  "showAgreeTerms",
  "termsAgreementLabel",
  "enableCustomHtml",
  "customHtml",
  "showName",
  "showFirstName",
  "showLastName",
  "showUsername",
  "showPhoneNumber",
  "showRegisterInfo",
  "lostPassword",
  "registerLink",
  "loginLink",
  "redirectType",
  "messageRedirect",
  "logoutRedirectType",
  "logoutRedirect",
  "emptyFieldsError",
  "passLengthError",
  "passMatchError"
]);

export function getLoginContentFromParsed(
  data: LoginProps
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of LOGIN_CONTENT_KEYS) {
    if (key in data && data[key as keyof LoginProps] !== undefined) {
      out[key] = data[key as keyof LoginProps];
    }
  }
  return out;
}

export function getLoginStyleFromParsed(
  data: LoginProps
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    if (
      !LOGIN_CONTENT_KEYS.has(key) &&
      data[key as keyof LoginProps] !== undefined
    ) {
      out[key] = data[key as keyof LoginProps];
    }
  }
  return out;
}

const loginPropertyDefinitions = {
  type: {
    type: "string",
    enum: ["login", "register", "forgot", "authorized"],
    description: "Form type (login, register, forgot password, or authorized)"
  },
  defaultRoles: {
    type: "string",
    description:
      "Default roles for register form. Provide as a JSON string array (e.g. '[\"role1\",\"role2\"]')."
  },
  showPlaceholder: {
    type: "string",
    enum: ["on", "off"],
    description: "Show placeholder in fields"
  },
  showLabel: {
    type: "string",
    enum: ["on", "off"],
    description: "Show labels"
  },
  remember: {
    type: "string",
    enum: ["on", "off"],
    description: "Show Remember me"
  },
  showRegisterLink: {
    type: "string",
    enum: ["on", "off"],
    description: "Show register link"
  },
  showLoginLink: {
    type: "string",
    enum: ["on", "off"],
    description: "Show back to login link"
  },
  showLostPassword: {
    type: "string",
    enum: ["on", "off"],
    description: "Show lost password link"
  },
  showAgreeTerms: {
    type: "string",
    enum: ["on", "off"],
    description: "Show the agree-to-terms checkbox"
  },
  termsAgreementLabel: {
    type: "string",
    description: "Agree terms label text (used when custom HTML is disabled)"
  },
  enableCustomHtml: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable custom HTML for the agree-to-terms label"
  },
  customHtml: {
    type: "string",
    description:
      "Custom HTML for the agree-to-terms label (used when enableCustomHtml is 'on')"
  },
  showName: {
    type: "string",
    enum: ["on", "off"],
    description: "Show the user's full name in authorized view"
  },
  showFirstName: {
    type: "string",
    enum: ["on", "off"],
    description: "Show First Name field in register form"
  },
  showLastName: {
    type: "string",
    enum: ["on", "off"],
    description: "Show Last Name field in register form"
  },
  showUsername: {
    type: "string",
    enum: ["on", "off"],
    description: "Show Username field in register form"
  },
  showPhoneNumber: {
    type: "string",
    enum: ["on", "off"],
    description: "Show Phone Number field in register form"
  },
  showRegisterInfo: {
    type: "string",
    enum: ["on", "off"],
    description: "Show extra register info text (Cloud only)"
  },
  lostPassword: { type: "string", description: "Lost password link text" },
  registerLink: { type: "string", description: "Register link text" },
  loginLink: { type: "string", description: "Login link text" },
  redirectType: {
    type: "string",
    enum: ["samePage", "custom"],
    description: "Redirect type after login/register submission"
  },
  messageRedirect: {
    type: "string",
    description: "Redirect URL value when redirectType is 'custom'"
  },
  logoutRedirectType: {
    type: "string",
    enum: ["samePage", "custom"],
    description: "Redirect type after logout (authorized view)"
  },
  logoutRedirect: {
    type: "string",
    description: "Redirect URL value when logoutRedirectType is 'custom'"
  },
  emptyFieldsError: {
    type: "string",
    description: "Error message when required fields are empty"
  },
  passLengthError: {
    type: "string",
    description: "Error message when password is too short"
  },
  passMatchError: {
    type: "string",
    description: "Error message when passwords do not match"
  },
  horizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description: "Form alignment"
  },
  size: {
    type: "string",
    enum: ["small", "medium", "large"],
    description: "Field size"
  },
  fontSize: {
    type: "number",
    description: "Font size in pixels (e.g. 30 for 30px)",
    minimum: 8,
    maximum: 200
  },
  fontFamily: { type: "string", description: "Font family" },
  fontWeight: {
    type: "number",
    description: "Font weight",
    minimum: 100,
    maximum: 900
  },
  lineHeight: {
    type: "number",
    description: "Line height",
    minimum: 0.5,
    maximum: 5
  },
  letterSpacing: { type: "number", description: "Letter spacing" },
  colorHex: { type: "string", description: "Color hex" },
  colorOpacity: {
    type: "number",
    description: "Color opacity",
    minimum: 0,
    maximum: 1
  },
  colorPalette: { type: "string", description: "Color palette" },
  bgColorHex: { type: "string", description: "Background hex" },
  bgColorOpacity: {
    type: "number",
    description: "Background opacity",
    minimum: 0,
    maximum: 1
  },
  bgColorPalette: { type: "string", description: "Background palette" },
  hoverBgColorHex: {
    type: "string",
    description: "Background color on hover (e.g. input hover state)"
  },
  hoverBgColorOpacity: {
    type: "number",
    description: "Hover background opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverBgColorPalette: {
    type: "string",
    description: "Hover background palette"
  },
  textColorHex: { type: "string", description: "Text color hex" },
  textColorOpacity: {
    type: "number",
    description: "Text opacity",
    minimum: 0,
    maximum: 1
  },
  textColorPalette: { type: "string", description: "Text palette" },
  linkColorHex: { type: "string", description: "Link color hex" },
  linkColorOpacity: {
    type: "number",
    description: "Link opacity",
    minimum: 0,
    maximum: 1
  },
  linkColorPalette: { type: "string", description: "Link palette" },
  lostColorHex: { type: "string", description: "Lost password link color hex" },
  lostColorOpacity: {
    type: "number",
    description: "Lost password link color opacity",
    minimum: 0,
    maximum: 1
  },
  lostColorPalette: { type: "string", description: "Lost password link palette" },
  registerInfoColorHex: {
    type: "string",
    description: "Register info color hex"
  },
  registerInfoColorOpacity: {
    type: "number",
    description: "Register info color opacity",
    minimum: 0,
    maximum: 1
  },
  registerInfoColorPalette: { type: "string", description: "Register info palette" },
  registerLinkColorHex: {
    type: "string",
    description: "Register link color hex"
  },
  registerLinkColorOpacity: {
    type: "number",
    description: "Register link color opacity",
    minimum: 0,
    maximum: 1
  },
  registerLinkColorPalette: { type: "string", description: "Register link palette" },
  loginLinkColorHex: { type: "string", description: "Login link color hex" },
  loginLinkColorOpacity: {
    type: "number",
    description: "Login link color opacity",
    minimum: 0,
    maximum: 1
  },
  loginLinkColorPalette: { type: "string", description: "Login link palette" },
  agreementColorHex: {
    type: "string",
    description: "Agree terms checkbox/label color hex"
  },
  agreementColorOpacity: {
    type: "number",
    description: "Agree terms color opacity",
    minimum: 0,
    maximum: 1
  },
  agreementColorPalette: { type: "string", description: "Agree terms palette" },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border style"
  },
  borderWidth: { type: "number", description: "Border width", minimum: 0 },
  borderRadius: { type: "number", description: "Border radius", minimum: 0 },
  borderColorHex: { type: "string", description: "Border color hex" },
  borderColorOpacity: {
    type: "number",
    description: "Border opacity",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: { type: "string", description: "Border palette" },
  padding: { type: "number", description: "Padding", minimum: 0 },
  fieldPadding: {
    type: "number",
    description: "Spacing between form fields in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  boxShadow: {
    type: "string",
    enum: ["none", "on"],
    description:
      "Enable box shadow. Set to 'on' for shadow to show; set shadow props (blur, color, etc.) and this is auto-set to 'on'."
  },
  boxShadowColorHex: {
    type: "string",
    description: "Box shadow color hex (e.g. '#000000')"
  },
  boxShadowColorOpacity: {
    type: "number",
    description: "Box shadow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  boxShadowColorPalette: { type: "string", description: "Box shadow palette" },
  boxShadowBlur: {
    type: "number",
    description: "Box shadow blur radius in pixels",
    minimum: 0
  },
  boxShadowSpread: {
    type: "number",
    description: "Box shadow spread in pixels"
  },
  boxShadowVertical: {
    type: "number",
    description: "Box shadow vertical offset in pixels"
  },
  boxShadowHorizontal: {
    type: "number",
    description: "Box shadow horizontal offset in pixels"
  }
};

export const addLoginDefinition: ToolDefinition = {
  name: "addLogin",
  strict: true,
  description: "Add a Login form to an EXISTING Section.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column"
      },
      insertIndex: {
        type: "number",
        description: "Position (0-indexed)",
        minimum: 0
      },
      ...loginPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateLoginDefinition: ToolDefinition = {
  name: "updateLogin",
  strict: true,
  description:
    "Update a Login element. Use searchElements({type:'Login'}) to find IDs. To change a specific field's width or label, use updateLoginField with the field's element ID.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Login element to update"
      },
      ...loginPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

// LoginField / RegisterField / ForgotPasswordField (child of Login)
export const loginFieldPropsSchema = z.object({
  width: z.number().min(1).max(100).optional(),
  label: z.string().optional()
});
export type LoginFieldProps = z.infer<typeof loginFieldPropsSchema>;

const loginFieldPropertyDefinitions = {
  width: {
    type: "number",
    description:
      "Field width in percent (1-100). Same as Spacing/Width in the field's toolbar.",
    minimum: 1,
    maximum: 100
  },
  label: {
    type: "string",
    description: "Label text for this field"
  }
} as const;

export const updateLoginFieldDefinition: ToolDefinition = {
  name: "updateLoginField",
  strict: true,
  description:
    "Update a single Login form field (email, password, register field, etc.) by its element ID. Use searchElements({type:'LoginField'}) or type:'RegisterField' or type:'ForgotPasswordField' to find field IDs. Use this to set field width (1-100%) or label.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description:
          "ID of the LoginField, RegisterField, or ForgotPasswordField to update"
      },
      ...loginFieldPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addLoginConfig: AddToolConfig = {
  kind: "add",
  definition: addLoginDefinition,
  elementType: ElementTypes.Login,
  schema: loginPropsSchema,
  defaults: withLoginDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addLogin input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = withLoginDefaults(props);
    const parsed = loginPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Login,
      insertIndex: insertIndex as number | undefined,
      initialProperties: parsed.data
    });
    log.tools("addLogin output %o", result);
    return result;
  }
};

export const updateLoginConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateLoginDefinition,
  elementType: ElementTypes.Login,
  schema: loginPropsSchema,
  defaults: withLoginDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateLogin input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withLoginDefaults(props);
    const parsed = loginPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.Login,
      changes: parsed.data
    });
    log.tools("updateLogin output %o", result);
    return result;
  }
};

export const updateLoginFieldConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateLoginFieldDefinition,
  elementType: ElementTypes.LoginField,
  schema: loginFieldPropsSchema,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateLoginField input %o", args);
    const { elementId, ...props } = args;

    const parsed = loginFieldPropsSchema.safeParse(props);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const elementResult = deps.pageRepository.getElementById(elementId as string);
    if (!elementResult.success) return elementResult;

    const elementType = elementResult.data?.type;
    const allowed = new Set<string>([
      ElementTypes.LoginField,
      ElementTypes.RegisterField,
      ElementTypes.ForgotPasswordField
    ]);

    if (typeof elementType !== "string" || !allowed.has(elementType)) {
      return {
        success: false,
        error:
          "updateLoginField can only be used for LoginField/RegisterField/ForgotPasswordField elements."
      };
    }

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType,
      changes: parsed.data
    });
    log.tools("updateLoginField output %o", result);
    return result;
  }
};

/**
 * Returns true when the element is the submit Button embedded inside a Login
 * form. The Login form renders its button via EditorArrayComponent with type
 * Button and parentType Login, so this is a reliable identifier.
 * Used by removeElement to prevent the AI from deleting it.
 */
export function isLoginSubmitButton(element: ElementDetails): boolean {
  return (
    element.type === ElementTypes.Button &&
    element.parentType === ElementTypes.Login
  );
}

/**
 * Returns true when the element is any LoginField inside a Login form.
 * Login form fields (email, password, remember-me, etc.) are fixed structural
 * parts of the form and must not be duplicated.
 * Used by duplicateElement to prevent the AI from cloning them.
 */
export function isLoginField(element: ElementDetails): boolean {
  return (
    (element.type === ElementTypes.LoginField ||
      element.type === ElementTypes.RegisterField ||
      element.type === ElementTypes.ForgotPasswordField) &&
    element.parentType === ElementTypes.Login
  );
}
