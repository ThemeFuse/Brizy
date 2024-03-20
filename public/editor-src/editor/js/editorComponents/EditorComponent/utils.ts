import deepMerge from "deepmerge";
import { mPipe } from "fp-utilities";
import { getIn } from "timm";
import { flatten, intersection, isEmpty } from "underscore";
import {
  ElementDefaultValue,
  ElementModel
} from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { OptionName, OptionValue } from "visual/component/Options/types";
import { fromElementModel } from "visual/component/Options/types/utils/fromElementModel";
import { toElementModel } from "visual/component/Options/types/utils/toElementModel";
import { isOption } from "visual/component/Options/utils";
import {
  ParsedToolbarData,
  ToolbarConfig
} from "visual/editorComponents/EditorComponent/types";
import {
  OptionDefinition,
  ToolbarItemType,
  is as isToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import Shortcodes from "visual/shortcodeComponents";
import { DeviceMode, UserRole } from "visual/types";
import { Dictionary } from "visual/types/utils";
import * as Device from "visual/utils/devices";
import {
  ALL,
  DESKTOP as DesktopDevice,
  RESPONSIVE,
  getDevice,
  supportsMode
} from "visual/utils/devices";
import { IS_PRO } from "visual/utils/env";
import { findDeep } from "visual/utils/object";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { defaultValueKey2 } from "visual/utils/onChange/device";
import { filter } from "visual/utils/options/filter";
import { hasChilds } from "visual/utils/options/match";
import { getChildOptions } from "visual/utils/options/match/utils";
import { reduce } from "visual/utils/options/reduce";
import * as Obj from "visual/utils/reader/object";
import * as Responsive from "visual/utils/responsiveMode";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";
import { camelCase } from "visual/utils/string";
import { NoEmptyString } from "visual/utils/string/NoEmptyString";
import * as Literal from "visual/utils/types/Literal";
import { isT } from "visual/utils/value";
import { isNullish } from "visual/utils/value";

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
  !String(type).startsWith("legacy-");

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
  (keys: string[]): (defaultValue: ElementDefaultValue) => ElementModel;
}

export const flattenDefaultValue_: FlattenDefaultValueFn = (keys) => {
  const keysMap: Dictionary<boolean> = keys.reduce((acc, k) => {
    acc[k] = true;
    return acc;
  }, {} as Dictionary<boolean>);

  return function inner(
    defaultValue: ElementDefaultValue | ElementModel
  ): ElementModel {
    const ret: ElementModel = {};

    for (const [k, v] of Object.entries(defaultValue)) {
      if (keysMap[k] && Obj.isObject(v)) {
        Object.assign(ret, inner(v));
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

export const filterToolbarItems =
  (deviceMode: DeviceMode, role: string) =>
  <T extends ToolbarItemType>(item: T): boolean => {
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

export const filterOptions = (
  device: DeviceMode,
  role: UserRole
): ((o: OptionDefinition) => OptionDefinition) =>
  // @ts-expect-error, OptionDefinition type is not same ToolbarItemType, but it extends.
  // Anyway, we need to fix this
  filter(filterToolbarItems(device, role));

export const filterProOptions = (isPro: boolean) =>
  filter((item) => !(item.isPro === true && isPro === false));

// INFO: we don't use options "filter" function because this returns popover with filtered options inside
export const filterCSSOptions = (
  options: ToolbarItemType[]
): ToolbarItemType[] => {
  return flatten(
    options.map((o) => {
      const opt = Obj.read(o);

      if (opt) {
        if (Obj.hasSomeKey(["selector", "style"], opt)) {
          return opt;
        }

        const isToolbarItem = isToolbarItemType(
          (o) => Obj.isObject(o) && Obj.hasKey("id", o)
        )(opt);

        if (isToolbarItem && hasChilds(opt)) {
          const childOptions = getChildOptions(opt);

          return filterCSSOptions(childOptions);
        }
      }
    })
  ).filter(isT) as ToolbarItemType[];
};

export const getProTitle = (
  type: NoEmptyString,
  model: ElementModel
): string | undefined => {
  const element = Object.values(Shortcodes)
    .flat()
    .filter((item) => item.pro)
    .map((item) => ({
      title: item.component.title,
      type: getIn(item.component.resolve, ["value", "items", 0, "type"]) ?? ""
    }))
    .filter((item) => {
      if (item.type === "Image") {
        return (
          Array.isArray(model._styles) &&
          intersection(model._styles, ["image--dynamic"]).length > 0
        );
      }
      return true;
    })
    .find((item) => item.type === type);

  if (element !== undefined && !IS_PRO) {
    return element.title;
  }

  return undefined;
};

function getKey(id: string, key: string) {
  return defaultValueKey({
    device: DESKTOP,
    state: "normal",
    key: createOptionId(id, key)
  });
}

function generateKeyValue<T extends OptionName>({
  value,
  devices
}: {
  value: Partial<OptionValue<T>>;
  devices?: Device.Device;
}): Record<string, Partial<OptionValue<T>>> {
  // generate keys for device based on :
  // device === RESPONSIVE => ["tablet", "mobile"]
  // all || desktop || undefined => ["desktop"]
  const modes = devices === "responsive" ? [MOBILE, TABLET] : [DESKTOP];

  return Object.keys(value).reduce(
    (acc, key) => ({
      ...acc,
      ...modes.reduce((acc, device) => {
        return {
          ...acc,
          // at the moment we need to generate only keys per device, without state
          [defaultValueKey2({ key, device, state: "normal" })]:
            value[key as keyof typeof value]
        };
      }, {})
    }),
    {}
  );
}

function parseOption(
  acc: ParsedToolbarData,
  option: ToolbarItemType
): ParsedToolbarData {
  const elementModel = toElementModel(option.type, (key) =>
    getKey(option.id, key)
  );
  const getModel = fromElementModel(option.type);

  const getter: FromElementModelGetter = (k) => {
    const v = Obj.read(option.default);

    if (v) {
      const getValue = mPipe(Obj.readKey(k), Literal.read);
      return getValue(v);
    }

    return Literal.read(option.default);
  };

  const optionModel = elementModel(getModel(getter));
  if (isNullish(optionModel)) {
    return acc;
  }
  // Stringify parse because some values is undefined
  const value = JSON.parse(JSON.stringify(optionModel));
  if (isEmpty(value)) {
    return acc;
  }

  const defaultValues = generateKeyValue<OptionName>({
    value: value,
    devices: option.devices
  });

  return {
    dv: { ...acc.dv, ...defaultValues },
    DCKeys: [
      ...acc.DCKeys,
      ...(option.hasOwnProperty("population") ? [option.id] : [])
    ]
  };
}

export function getToolbarData(toolbar?: ToolbarItemType[]): ParsedToolbarData {
  const data = { dv: {}, DCKeys: [] };

  if (!toolbar) {
    return data;
  }

  return deepMerge.all(
    toolbar.map((option) => reduce(parseOption, data, option))
  ) as ParsedToolbarData;
}

const responsiveModeByDevice = {
  [DesktopDevice]: [DESKTOP],
  [RESPONSIVE]: [TABLET, MOBILE],
  [ALL]: [DESKTOP, TABLET, MOBILE]
};

export function getResponsiveModeByDevice({
  optionDevices = ALL,
  currentDevice
}: {
  optionDevices?: Device.Device;
  currentDevice: ResponsiveMode;
}): ResponsiveMode {
  if (responsiveModeByDevice[optionDevices].includes(currentDevice)) {
    return currentDevice;
  }
  return DESKTOP;
}

function getOptionConfigById({
  id,
  toolbarConfig
}: {
  id: string;
  toolbarConfig: ToolbarConfig[];
}): ToolbarItemType | undefined {
  return findDeep(toolbarConfig, (option: Record<string, unknown>) => {
    return isOption(option) && option.id === id;
  }).obj;
}

export function getOptionValueByDevice({
  v,
  id,
  currentDevice,
  toolbarConfig
}: {
  v: ElementModel;
  id: string;
  currentDevice: DeviceMode;
  toolbarConfig: ToolbarConfig[];
}): Record<string, unknown> | undefined {
  const { type: optionType, devices: optionDevices } =
    getOptionConfigById({ id, toolbarConfig }) ?? {};

  if (optionType) {
    const device = getResponsiveModeByDevice({
      optionDevices,
      currentDevice
    });

    const getModel = fromElementModel(optionType);
    return getModel((k: string) =>
      defaultValueValue({ v, device, key: createOptionId(id, k) })
    );
  }
}
