import { getIn } from "timm";
import { intersection } from "underscore";
import Shortcodes from "visual/shortcodeComponents";
import * as Obj from "visual/utils/reader/object";
import { camelCase } from "visual/utils/string";
import * as Responsive from "visual/utils/responsiveMode";
import * as Device from "visual/utils/devices";
import { getDevice, supportsMode } from "visual/utils/devices";
import { ElementModel } from "visual/component/Elements/Types";
import { Dictionary } from "visual/types/utils";
import { DeviceMode } from "visual/types";
import {
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { IS_PRO } from "visual/utils/env";
import { NoEmptyString } from "visual/utils/string/NoEmptyString";

/**
 * Create an complete option id that consists from 2 parts: base id and suffix
 * - The result is a string in camelCase style
 * - If the suffix === 'value', return id without suffixing it
 *
 * @param {string} id
 * @param {string} suffix
 * @returns {string}
 */
export const createOptionId = (id: string, suffix: string): string => {
  const temp = suffix.startsWith("temp") ? "temp" : "";
  const key = temp.length ? suffix.substr(4) : suffix;
  const _suffix = key === "value" || key === "Value" ? "" : key;

  return camelCase([temp, id, _suffix]);
};

/**
 * Prefixes option value keys with a specific prefix
 * - If the option is not an object, then the original option is returned
 * - If the object key is equal to "value", prefix is used as full key
 *   because value under "value" key is considered as root value
 *
 * @param {string} prefix
 * @param {object} option
 * @return {object|*}
 */
export const setOptionPrefix = (
  prefix: string,
  option: ElementModel
): ElementModel => {
  if (option && typeof option === "object") {
    return Object.keys(option).reduce((acc, k) => {
      acc[createOptionId(prefix, k)] = option[k];
      return acc;
    }, {} as ElementModel);
  }

  return option;
};

/**
 * Check if the option type is in development
 * Options that are in development should always end with "-dev" in type name
 *
 * @param type
 * @return {boolean}
 */
export const inDevelopment = (type: string): boolean =>
  String(type).endsWith("-dev");

/**
 * Checks if the option supports provided responsive mode
 *  - if it does, return the current mode
 *  - if it doesn't, return default mode
 *
 * @param mode
 * @param option
 * @returns {string}
 */
export const optionMode = (
  mode: Responsive.ResponsiveMode,
  option: { devices: Device.Device }
): Responsive.ResponsiveMode =>
  supportsMode(mode, getDevice(option)) ? mode : Responsive.empty;

export interface ToolbarPropsFromConfig {
  allowExtend?: boolean;
  allowExtendFromParent?: boolean;
  allowExtendFromChild?: boolean;
  allowExtendFromThirdParty?: boolean;
  allowSidebarExtend?: boolean;
  allowSidebarExtendFromParent?: boolean;
  allowSidebarExtendFromChild?: boolean;
  allowSidebarExtendFromThirdParty?: boolean;
  parentItemsFilter?: (o: OptionDefinition[]) => OptionDefinition[];
  parentExtendProp?: string;
  thirdPartyExtendId?: string;
  sidebarThirdPartyExtendId?: string;
}

export const makeToolbarPropsFromConfigDefaults = (
  options: ToolbarPropsFromConfig
): ToolbarPropsFromConfig => {
  const allowExtend = options.allowExtend ?? true;
  const allowExtendFromParent = options.allowExtendFromParent ?? allowExtend;
  const allowExtendFromChild = options.allowExtendFromChild ?? allowExtend;
  const allowExtendFromThirdParty =
    options.allowExtendFromThirdParty ?? allowExtend;

  const allowSidebarExtend = options.allowSidebarExtend ?? allowExtend;
  const allowSidebarExtendFromParent =
    options.allowSidebarExtendFromParent ??
    options.allowSidebarExtend ??
    allowExtendFromParent;
  const allowSidebarExtendFromChild =
    options.allowSidebarExtendFromChild ??
    options.allowSidebarExtend ??
    allowExtendFromChild;
  const allowSidebarExtendFromThirdParty =
    options.allowSidebarExtendFromThirdParty ??
    options.allowSidebarExtend ??
    allowExtendFromThirdParty;

  return {
    ...options,
    allowExtend,
    allowExtendFromParent,
    allowExtendFromChild,
    allowExtendFromThirdParty,
    allowSidebarExtend,
    allowSidebarExtendFromParent,
    allowSidebarExtendFromChild,
    allowSidebarExtendFromThirdParty
  };
};

interface FlattenDefaultValueFn {
  (keys: string[]): (defaultValue: ElementModel) => ElementModel;
}
export const flattenDefaultValue_: FlattenDefaultValueFn = keys => {
  const keysMap: Dictionary<boolean> = keys.reduce((acc, k) => {
    acc[k] = true;
    return acc;
  }, {} as Dictionary<boolean>);

  return function inner(defaultValue: ElementModel): ElementModel {
    const ret: ElementModel = {};

    for (const [k, v] of Object.entries(defaultValue)) {
      if (keysMap[k] && Obj.isObject(v)) {
        Object.assign(ret, inner(v as ElementModel));
      } else {
        ret[k] = v;
      }
    }

    return ret;
  };
};
export const flattenDefaultValue = flattenDefaultValue_([
  "animation",
  "content",
  "families",
  "images",
  "link",
  "style",
  "styles",
  "symbols",
  "toolbar"
]);

export const filterToolbarItems = (deviceMode: DeviceMode, role: string) => <
  T extends ToolbarItemType
>(
  item: T
): boolean => {
  const { type, disabled, devices, roles } = item;

  if (!type) {
    return false;
  }

  if (disabled === true) {
    return false;
  }

  if (devices && devices !== "all") {
    if (devices === "desktop" && deviceMode !== "desktop") {
      return false;
    }

    if (devices === "responsive" && deviceMode === "desktop") {
      return false;
    }
  }

  if (Array.isArray(roles) && !roles.includes(role)) {
    return false;
  }

  return true;
};

export const getProTitle = (
  type: NoEmptyString,
  model: ElementModel
): string | undefined => {
  const element = Object.values(Shortcodes)
    .flat()
    .filter(item => item.pro)
    .map(item => ({
      title: item.component.title,
      type: getIn(item.component.resolve, ["value", "items", 0, "type"]) ?? ""
    }))
    .filter(item => {
      if (item.type === "Image") {
        return (
          Array.isArray(model._styles) &&
          intersection(model._styles, ["image--dynamic"]).length > 0
        );
      }
      return true;
    })
    .find(item => item.type === type);

  if (element !== undefined && !IS_PRO) {
    return element.title;
  }

  return undefined;
};
