import { Bool, Obj } from "@brizy/readers";
import deepMerge from "deepmerge";
import { flatten, intersection, lowerFirst } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { mPipe, or } from "fp-utilities";
import { getIn } from "timm";
import { ElementModel } from "visual/component/Elements/Types";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import type { OptionName, OptionValue } from "visual/component/Options/types";
import type {
  GetElementModelKeyFn,
  ParsedToolbarData,
  ProElementTitle,
  ToolbarConfig
} from "visual/editorComponents/EditorComponent/types";
import {
  type OptionDefinition,
  type ToolbarItemType,
  hasId,
  is as isToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Store } from "visual/redux/store";
import { getFlatShortcodes } from "visual/shortcodeComponents/utils";
import type { DeviceMode, UserRole } from "visual/types";
import type { CSSSymbol } from "visual/types/Symbols";
import { isActiveKey, isHoverKey } from "visual/utils/cssStyle";
import * as Device from "visual/utils/devices";
import {
  ALL,
  DESKTOP as DesktopDevice,
  RESPONSIVE,
  getDevice,
  supportsMode
} from "visual/utils/devices";
import { isPro } from "visual/utils/env";
import { flattenDefaultValue as flattenDefaultValue_ } from "visual/utils/models/flattenDefaultValue";
import { findDeep } from "visual/utils/object";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { defaultValueKey2 } from "visual/utils/onChange/device";
import { filter } from "visual/utils/options/filter";
import { hasChilds } from "visual/utils/options/match";
import {
  getChildOptions,
  isPopulationWithOption
} from "visual/utils/options/match/utils";
import { reduce } from "visual/utils/options/reduce";
import { isOption } from "visual/utils/options/utils";
import { fromElementModel } from "visual/utils/options/utils/fromElementModel";
import { toElementModel } from "visual/utils/options/utils/toElementModel";
import { hasSomeKey } from "visual/utils/reader/object";
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
import { isNullish, isT } from "visual/utils/value";

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

const checkIsToolbarItem = isToolbarItemType(hasId);

// INFO: we don't use options "filter" function because this returns popover with filtered options inside
export const filterCSSOptions = (
  options: ToolbarItemType[]
): ToolbarItemType[] => {
  return flatten(
    options.map((o) => {
      const opt = Obj.read(o);

      if (opt) {
        if (hasSomeKey(["selector", "style"], opt)) {
          return opt;
        }

        const isToolbarItem = checkIsToolbarItem(opt);

        if (isToolbarItem && hasChilds(opt)) {
          const childOptions = getChildOptions(opt);

          return filterCSSOptions(childOptions);
        }

        if (isPopulationWithOption(o)) {
          return filterCSSOptions([o.option]);
        }
      }
    })
  ).filter(isT) as ToolbarItemType[];
};

export const getProTitle = (
  type: NoEmptyString,
  model: ElementModel,
  config: ConfigCommon
): ProElementTitle | undefined => {
  const shortcodes = getFlatShortcodes(config);
  const element = Object.values(shortcodes)
    .flat()
    .filter((item) => typeof item.pro === "function" || item.pro)
    .map((item) => ({
      title: item.component.title,
      type: getIn(item.component.resolve, ["value", "items", 0, "type"]) ?? "",
      upgradeMessage: item.component.upgradeMessage,
      upgradeActionMessage: item.component.upgradeActionMessage,
      pro: item.pro
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

  if (
    element !== undefined &&
    (typeof element.pro === "function" ? element.pro(config) : !isPro(config))
  ) {
    return {
      title: element.title,
      upgradeMessage: element.upgradeMessage,
      upgradeActionMessage: element.upgradeActionMessage
    };
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
  option: ToolbarItemType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Store
): ParsedToolbarData {
  const elementModel = toElementModel(option.type, (key) =>
    getKey(option.id, key)
  );
  const getModel = fromElementModel(option.type);

  const getter: FromElementModelGetter = (k) => {
    const v = Obj.read(option.default);

    if (v) {
      const getValue = mPipe(Obj.readKey(k), or(Literal.read, Bool.read));
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

export function getToolbarData(
  store: Store,
  toolbar?: ToolbarItemType[]
): ParsedToolbarData {
  const data: ParsedToolbarData = {
    dv: {},
    DCKeys: []
  };

  if (!toolbar) {
    return data;
  }

  return deepMerge.all(
    toolbar.map((option) =>
      reduce(
        (acc, item) => {
          return parseOption(acc, item, store);
        },
        data,
        option
      )
    )
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
  store: Store;
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

  if (id in v) {
    return { value: v[id] };
  }

  return undefined;
}

export const getElementModelKeyFn: GetElementModelKeyFn =
  ({ device, state, option }) =>
  (key: string) => {
    const { id, type, preserveId } = option;

    const isDev = inDevelopment(type);

    if (id === "tabsState" || !isDev) {
      return id;
    }

    const device_ = preserveId === true ? DESKTOP : device;

    return defaultValueKey({
      key: createOptionId(id, key),
      device: device_,
      state
    });
  };

export const createClassName = (
  _type: string,
  classes: Array<CSSSymbol>
): string => {
  const type = _type.toLowerCase();
  const availableClasses = classes.filter(
    (css) => css.type.toLowerCase() === type
  );

  return `brz-${type}-${availableClasses.length + 1}`;
};

export const createDuplicatedClassName = (className: string): string =>
  `${className}-Copy`;

export const createWrapperClassName = (
  _type: string,
  _childrenType: string,
  classes: Array<CSSSymbol>
): string => {
  const type = _type.toLowerCase();
  const childrenType = _childrenType.toLowerCase();
  const availableClasses = classes.filter(
    (css) => css.type.toLowerCase() === type
  );

  return `brz-${type}-${childrenType}-${availableClasses.length + 1}`;
};

const mergePatch = <M>(patches: M, patch: M): M => {
  return { ...patches, ...patch };
};

export function createPatch<M extends ElementModel>(
  patch: M,
  styles: ElementModel
) {
  const keys: { styles: Array<M>; content: Array<M> } = {
    styles: [],
    content: []
  };

  Object.entries(patch).forEach(([key, value]) => {
    if (key in styles) {
      keys.styles.push({ [key]: value } as M);
    } else {
      const normalStateKey = isHoverKey(key)
        ? lowerFirst(key.replace("hover", ""))
        : isActiveKey(key)
          ? lowerFirst(key.replace("active", ""))
          : key;

      if (normalStateKey in styles) {
        keys.styles.push({ [key]: value } as M);
      } else {
        keys.content.push({ [key]: value } as M);
      }
    }
  });

  const style =
    keys.styles.length > 0
      ? keys.styles.reduce(mergePatch, {} as M)
      : undefined;
  const content =
    keys.content.length > 0
      ? keys.content.reduce(mergePatch, {} as M)
      : undefined;

  return { style, content };
}
