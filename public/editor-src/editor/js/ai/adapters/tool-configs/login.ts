import {
  containerIdSchema,
  elementIdSchema,
  insertIndexSchema,
  type LoginProps,
  loginFieldPropsSchema,
  loginPropsSchema
} from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { ElementDetails } from "../../entities/models";
import { log } from "../../utils/logger";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

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
    withLoginBoxShadowDefaults(
      withAllFontFamilyNormalize(withColorDefaults(props))
    )
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
export const addLoginConfig: AddToolConfig = {
  kind: "add",
  alias: "addLogin",
  elementType: ElementTypes.Login,
  schema: loginPropsSchema,
  defaults: withLoginDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addLogin input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const propsWithDefaults = withLoginDefaults(props);
    const parsed = loginPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Login,
      insertIndex: insertIndexParsed.data,
      initialProperties: parsed.data
    });
    log.tools("addLogin output %o", result);
    return result;
  }
};
export const updateLoginConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateLogin",
  elementType: ElementTypes.Login,
  schema: loginPropsSchema,
  defaults: withLoginDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateLogin input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    const propsWithDefaults = withLoginDefaults(props);
    const parsed = loginPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.Login,
      changes: parsed.data
    });
    log.tools("updateLogin output %o", result);
    return result;
  }
};
export const updateLoginFieldConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateLoginField",
  elementType: ElementTypes.LoginField,
  schema: loginFieldPropsSchema,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateLoginField input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    const parsed = loginFieldPropsSchema.safeParse(props);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const elementResult = deps.pageRepository.getElementById(
      elementIdParsed.data
    );
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
      elementId: elementIdParsed.data,
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
