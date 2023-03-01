import classNames from "classnames";
import React, { ReactNode } from "react";
import _ from "underscore";
import { ElementModel } from "visual/component/Elements/Types";
import {
  fromElementModel,
  toElementModel
} from "visual/component/Options/types";
import { mergeOptions, optionMap } from "visual/component/Options/utils";
import {
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { Props as WrapperProps } from "visual/editorComponents/tools/Wrapper";
import * as GlobalState from "visual/global/StateMode";
import { deviceModeSelector, rulesSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { applyFilter } from "visual/utils/filters";
import {
  defaultValueKey,
  defaultValueValue
} from "visual/utils/onChange/device";
import { WithClassName } from "visual/utils/options/attributes";
import { wrapOption } from "visual/utils/options/utils";
import { attachRef } from "visual/utils/react";
import * as Str from "visual/utils/reader/string";
import * as Responsive from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import { Literal } from "visual/utils/types/Literal";
import { uuid } from "visual/utils/uuid";
import { MValue } from "visual/utils/value";
import {
  DCObjResult,
  getDCObjEditor,
  getDCObjPreview
} from "./DynamicContent/getDCObj";
import { dcKeyToKey, isDCKey, keyDCInfo } from "./DynamicContent/utils";
import { EditorComponentContext } from "./EditorComponentContext";
import {
  ContextMenuItem,
  ContextMenuProps,
  ECDC,
  ECKeyDCInfo,
  Meta,
  Model,
  NewToolbarConfig,
  OnChangeMeta,
  SidebarConfig
} from "./types";
import {
  createOptionId,
  flattenDefaultValue,
  inDevelopment,
  makeToolbarPropsFromConfigDefaults
} from "./utils";

const capitalize = ([first, ...rest]: string, lowerRest = false): string =>
  first.toUpperCase() +
  (lowerRest ? rest.join("").toLowerCase() : rest.join(""));

type Rule = string | { rule: string; mapper: <T>(m: T) => void };

type DefaultValueProcessed<T> = {
  defaultValueFlat: T;
  dynamicContentKeys: string[];
};

type OldToolbarConfig<M> = {
  getItemsForDesktop: (v: M, context?: unknown) => ToolbarItemType[];
  getItemsForTablet: (v: M, context?: unknown) => ToolbarItemType[];
  getItemsForMobile: (v: M, context?: unknown) => ToolbarItemType[];
};

export type ToolbarExtend = {
  getItems: (device?: Responsive.ResponsiveMode) => OptionDefinition[];
  getSidebarItems: (device?: Responsive.ResponsiveMode) => OptionDefinition[];
  getSidebarTitle: () => string;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export interface ComponentsMeta {
  desktopW?: number;
  desktopWNoSpacing?: number;
  tabletW?: number;
  tabletWNoSpacing?: number;
  mobileW?: number;
  mobileWNoSpacing?: number;
  sectionPopup?: boolean;
  sectionPopup2?: boolean;
  [k: string]: unknown;
}

export type Props<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<any, any>
> = WithClassName & {
  _id: string;
  dbValue: Model<M>;
  defaultValue: Model<M>;
  path: string[];
  reduxState: ReduxState;
  reduxDispatch: unknown;
  meta: ComponentsMeta;
  onChange: {
    (v: M | null, meta: OnChangeMeta<M>): void;
  };
  onToolbarOpen: () => void;
  onToolbarClose: () => void;
  onToolbarEnter: () => void;
  onToolbarLeave: () => void;
  toolbarExtend?: ToolbarExtend;
  wrapperExtend?: WrapperProps<P>;
  extendParentToolbar: (childToolbarExtend: ToolbarExtend) => void;
} & P;

export class EditorComponent<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> extends React.Component<Props<M, P>, S> {
  /**
   * @return {string}
   */
  static get componentId(): string {
    throw new Error(`${this.name} must implement \`static get componentId()\``);
  }

  /**
   *
   * @type {object}
   */
  static defaultProps = {
    meta: {},
    onToolbarOpen: _.noop,
    onToolbarClose: _.noop,
    onToolbarEnter: _.noop,
    onToolbarLeave: _.noop
  };

  static defaultValue: ElementModel = {};

  static experimentalDynamicContent = false;

  static contextType = EditorComponentContext;

  _defaultValueProcessedCache?: DefaultValueProcessed<M>;

  _dc: ECDC = {};

  childToolbarExtend?: ToolbarExtend;

  // shouldComponentUpdate(nextProps) {
  //   return this.optionalSCU(nextProps);
  // }

  getComponentId(): string {
    return (this.constructor as typeof EditorComponent).componentId;
  }

  optionalSCU(nextProps: Props<M, P>): boolean {
    const props = this.props;

    // check dbValue
    if (props.dbValue !== nextProps.dbValue) {
      // console.log("scu", this.constructor.componentId, "dbValue", true);
      return true;
    }

    // check redux
    if (props.reduxState.fonts !== nextProps.reduxState.fonts) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (
      props.reduxState.project.data.font !==
      nextProps.reduxState.project.data.font
    ) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    // console.log("scu", this.constructor.componentId, false);
    return false;
  }

  getId(): string {
    const raiseError = (): string => {
      throw new Error(
        "This should never happen. An initialized component must have a preset id"
      );
    };

    return this.props._id || Str.read(this.getDBValue()._id) || raiseError();
  }

  getReduxState(): Props<M, P>["reduxState"] {
    return this.props.reduxState;
  }

  getReduxDispatch(): Props<M, P>["reduxDispatch"] {
    return this.props.reduxDispatch;
  }

  getDefaultValue(): M {
    const defaultValueFlat = this.getDefaultValueProcessed().defaultValueFlat;

    return this.props.defaultValue
      ? { ...defaultValueFlat, ...this.props.defaultValue } // allows defaultValue overriding
      : defaultValueFlat;
  }

  getDefaultValueProcessed(): DefaultValueProcessed<M> {
    if (this._defaultValueProcessedCache) {
      return this._defaultValueProcessedCache;
    }

    const defaultValue = (this.constructor as typeof EditorComponent)
      .defaultValue as M;
    const defaultValueFlat = flattenDefaultValue(defaultValue) as M;
    const dynamicContentKeys = Object.keys(defaultValueFlat).reduce(
      (acc, k) => {
        if (isDCKey(k)) {
          acc.push(dcKeyToKey(k));
        }
        return acc;
      },
      [] as string[]
    );

    this._defaultValueProcessedCache = {
      defaultValueFlat,
      dynamicContentKeys
    };

    return this._defaultValueProcessedCache;
  }

  getDBValue(): Props<M, P>["dbValue"] {
    return this.props.dbValue;
  }

  getStylesValue(): ElementModel | null {
    const dbValue = this.getDBValue();
    const currentStyleRules: Record<string, ElementModel | undefined> =
      rulesSelector(this.getReduxState());

    if ("_styles" in dbValue && dbValue._styles && currentStyleRules) {
      return dbValue._styles.reduce((acc: Partial<M>, style: string) => {
        const ruleStyle = currentStyleRules[style];

        return ruleStyle ? Object.assign(acc, ruleStyle) : acc;
      }, {});
    }

    return null;
  }

  getDCValue(v: M): DCObjResult {
    const config = this.getDefaultValueProcessed().dynamicContentKeys;
    const getDCObjKeys: ECKeyDCInfo[] = [];

    for (const key of config) {
      const dcInfo = keyDCInfo(v, key);

      if (dcInfo.hasDC) {
        getDCObjKeys.push(dcInfo);
      }
    }

    const dcObjKeysAfterHook = this.getDCValueHook(getDCObjKeys, v);

    if (IS_PREVIEW) {
      return getDCObjPreview(dcObjKeysAfterHook).value;
    }

    this._dc.pendingDCObjIncomplete?.abortGetComplete();
    this._dc.pendingDCObjIncomplete = undefined;

    if (dcObjKeysAfterHook.length === 0) {
      this._dc.keys = undefined;
      this._dc.lastCache = undefined;

      return {};
    } else {
      const dcObj = getDCObjEditor(dcObjKeysAfterHook, this.context);

      if (dcObj.type === "complete") {
        this._dc.keys = dcObj.details;
        this._dc.lastCache = dcObj.value;

        return dcObj.value;
      } else {
        this._dc.pendingDCObjIncomplete = dcObj;
        this._dc.keys = dcObj.details;

        dcObj
          .getComplete()
          .then(() => {
            // forceUpdate so on the next tick
            // type would === "complete"
            this.forceUpdate();
          })
          .catch(() => {
            // aborted, do nothing
          });

        const fromLastCache: ECDC["lastCache"] = {};
        let needToMerge = false;

        if (this._dc.lastCache) {
          for (const x of dcObjKeysAfterHook) {
            if (x.key in this._dc.lastCache) {
              fromLastCache[x.key] = this._dc.lastCache[x.key];
              needToMerge = true;
            }
          }
        }

        return needToMerge
          ? { ...dcObj.partialValue, ...fromLastCache }
          : dcObj.partialValue;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDCValueHook(keys: ECKeyDCInfo[], _v: M): ECKeyDCInfo[] {
    return keys;
  }

  getValue(): M {
    return this.getValue2().v;
  }

  getValue2(): {
    v: M;
    vs: M;
    vd: M;
  } {
    const defaultValue = this.getDefaultValue();
    const stylesValue = this.getStylesValue();
    const dbValue = this.getDBValue();

    const v = { ...defaultValue, ...stylesValue, ...dbValue };

    return {
      v: (this.constructor as typeof EditorComponent).experimentalDynamicContent
        ? Object.assign(v, this.getDCValue(v))
        : v,
      vs: { ...defaultValue, ...stylesValue },
      vd: defaultValue
    };
  }

  patchValue(patch: Partial<Model<M>>, meta: Meta = {}): void {
    const newValue = { ...this.getDBValue(), ...patch };

    this.handleValueChange(newValue, {
      ...meta,
      patch
    });
  }

  validatePatch(
    patch: Partial<Model<M>>,
    item: ToolbarItemType,
    state: State.State,
    device: Responsive.ResponsiveMode
  ): void {
    const defaultValue = this.getDefaultValue();
    const missingKeys = Object.keys(patch).filter((k): boolean => {
      // identified in defaultValue
      if (k in defaultValue) return false;

      // is core key
      if (k[0] === "_" || k === "tabsState") return false;

      // is legacy key
      if (k === "tabsCurrentElement") return false;

      // No need to notify about `temp` keys
      if (
        k.startsWith(
          defaultValueKey({
            key: createOptionId("temp", item.id),
            state,
            device
          })
        )
      ) {
        return false;
      }

      // No need to notify about State and Device keys
      if (State.empty !== state || Responsive.empty !== device) {
        if (k.startsWith(defaultValueKey({ key: item.id, state, device }))) {
          return false;
        }

        if (
          k.startsWith(
            defaultValueKey({
              key: createOptionId("temp", item.id),
              state,
              device
            })
          )
        )
          return false;
      }

      // is symbols_
      if (k.startsWith("symbol_")) return false;

      return true;
    });

    if (missingKeys.length) {
      const missingKeysFormatted = JSON.stringify(missingKeys, null, 2);
      const valueFormatted = JSON.stringify(
        patch,
        (_, v) => (Array.isArray(v) ? "[...]" : v),
        2
      );

      console.error(
        `${this.getComponentId()} element\n\nKeys not in defaultValue:\n${missingKeysFormatted}\nTried to update with:\n${valueFormatted}`
      );
    }
  }

  handleValueChange(newValue: Model<M>, meta: OnChangeMeta<M>): void {
    this.props.onChange(newValue, meta);
  }

  selfDestruct(): void {
    this.props.onChange(null, { intent: "remove_all" });
  }

  bindPatchValue = (patch: Partial<ElementModel>): void =>
    this.patchValue(patch as Partial<Model<M>>);

  makeWrapperProps = (props: Partial<WrapperProps<P>>): WrapperProps<P> => {
    const extend = this.props.wrapperExtend ?? ({} as WrapperProps<P>);
    const className = classNames(extend.className, props.className);
    const attributes = {
      ...(extend.attributes || {}),
      ...(props.attributes || {})
    } as Record<string, string | number>;

    return {
      ...extend,
      ...props,
      className,
      attributes,
      id: this.getId(),
      componentId: this.getComponentId(),
      meta: this.props.meta,
      ...this.getValue2(),
      // ! is it ok to use here type assertion - as Partial<Model<M>> ?!
      onChange: this.bindPatchValue,
      ref: (v: HTMLElement | null): void => {
        attachRef(v, extend.ref || null);
        attachRef(v, props.ref || null);
      }
    };
  };

  makeSubcomponentProps({
    bindWithKey,
    ...otherProps
  }: { bindWithKey: keyof M } & { [key: string]: unknown }): unknown {
    if (process.env.NODE_ENV === "development") {
      if (!(bindWithKey in this.getDefaultValue())) {
        /* eslint-disable no-console */
        console.error(
          "Invalid value: %s for bindWithKey. Check that %s.getDefaultValue() contains the key %s",
          bindWithKey,
          this.constructor.name,
          bindWithKey
        );
        /* eslint-enabled no-console */
      }
    }

    const defaultValue = this.getDefaultValue();
    const dbValue = this.getDBValue();
    const onChange = (value: Literal, meta: Meta): void =>
      this.patchValue({ [bindWithKey]: value } as Partial<Model<M>>, meta);

    return {
      ...otherProps,
      _id: `${this.getId()}-${String(bindWithKey)}`,
      defaultValue: defaultValue && defaultValue[bindWithKey],
      dbValue: dbValue && dbValue[bindWithKey],
      reduxState: this.getReduxState(),
      reduxDispatch: this.getReduxDispatch(),
      onChange: onChange
    };
  }

  makeContextMenuProps(
    config: {
      getItems: (v: M, context?: unknown) => ContextMenuItem[];
    },
    extraProps = {}
  ): ContextMenuProps<M> {
    const componentId = this.getComponentId();
    const v = this.getValue();

    return {
      id: uuid(3),
      componentId,
      getItems: config.getItems.bind(null, v, this),
      ...extraProps
    };
  }

  makeToolbarPropsFromConfig(
    config: OldToolbarConfig<M>,
    sidebarConfig?: SidebarConfig<M, P, S>,
    options = {} /* options */
  ): ToolbarExtend {
    const { onToolbarOpen, onToolbarClose, onToolbarEnter, onToolbarLeave } =
      this.props;
    const {
      allowExtendFromParent,
      parentItemsFilter,
      allowExtendFromChild,
      allowExtendFromThirdParty,
      thirdPartyExtendId = this.getComponentId(),

      // sidebar
      allowSidebarExtendFromParent,
      allowSidebarExtendFromChild,
      allowSidebarExtendFromThirdParty,
      sidebarThirdPartyExtendId = thirdPartyExtendId
    } = makeToolbarPropsFromConfigDefaults(options);

    // WARNING: we use getStore instead of this.getReduxState()
    // because the page does not rerender when changing deviceMode
    // and thus we might get false (outdated) results
    const getItems = (
      deviceMode = deviceModeSelector(getStore().getState())
    ): OptionDefinition[] => {
      const getItemsFnName = `getItemsFor${capitalize(
        deviceMode,
        true
      )}` as keyof OldToolbarConfig<M>;

      if (process.env.NODE_ENV === "development") {
        if (!config[getItemsFnName]) {
          // eslint-disable-next-line no-console
          console.warn(
            `${this.getComponentId()}. ${getItemsFnName} not found in toolbarConfig`
          );
        }
      }

      const getItemsFn = config[
        getItemsFnName
      ] as OldToolbarConfig<M>[typeof getItemsFnName];
      const v = this.getValue();
      const stateMode = State.mRead(v.tabsState);
      let items = this.bindToolbarItems(
        v,
        deviceMode,
        stateMode,
        getItemsFn?.(v, this) ?? []
      );

      // allow extend from parent
      if (allowExtendFromParent && this.props.toolbarExtend) {
        const { getItems } = this.props.toolbarExtend as ToolbarExtend;
        let extendItems = getItems(deviceMode);

        if (typeof parentItemsFilter === "function") {
          extendItems = parentItemsFilter(extendItems);
        }

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (allowExtendFromChild && this.childToolbarExtend) {
        const { getItems } = this.childToolbarExtend;
        const extendItems = getItems(deviceMode);

        items = mergeOptions(extendItems, items);
      }

      // allow extend from third party
      if (allowExtendFromThirdParty) {
        const thirdPartyConfig = applyFilter(
          `toolbarItemsExtend_${thirdPartyExtendId}`,
          null
        );

        if (thirdPartyConfig?.[getItemsFnName]) {
          const thirdPartyItems = this.bindToolbarItems(
            v,
            deviceMode,
            stateMode,
            thirdPartyConfig[getItemsFnName](v, this)
          );

          items = mergeOptions(items, thirdPartyItems);
        }
      }

      return items;
    };

    const getSidebarItems = (
      deviceMode = deviceModeSelector(getStore().getState())
    ): OptionDefinition[] => {
      const v = this.getValue();
      const stateMode = State.mRead(v.tabsState);
      let items = this.bindToolbarItems(
        v,
        deviceMode,
        stateMode,
        sidebarConfig?.getItems?.({
          v,
          component: this,
          device: deviceMode,
          state: stateMode,
          context: this.context
        }) || []
      );

      // allow extend from parent
      if (
        allowSidebarExtendFromParent &&
        (this.props.toolbarExtend as ToolbarExtend)?.getSidebarItems
      ) {
        const { getSidebarItems } = this.props.toolbarExtend as ToolbarExtend;
        const extendItems = getSidebarItems(deviceMode);

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (allowSidebarExtendFromChild && this.childToolbarExtend) {
        const { getSidebarItems } = this.childToolbarExtend;
        const extendItems = getSidebarItems(deviceMode);

        items = mergeOptions(extendItems, items);
      }

      // allow extend from third party
      if (allowSidebarExtendFromThirdParty) {
        const thirdPartyConfig = applyFilter(
          `sidebarItemsExtend_${sidebarThirdPartyExtendId}`,
          null
        );

        if (thirdPartyConfig?.getItems) {
          const thirdPartyItems = this.bindToolbarItems(
            v,
            deviceMode,
            stateMode,
            thirdPartyConfig.getItems({
              v,
              component: this,
              device: deviceMode,
              state: stateMode
            })
          );

          items = mergeOptions(items, thirdPartyItems);
        }
      }

      return items;
    };

    const getSidebarTitle = (): string => {
      let title = sidebarConfig?.title;

      if (typeof title === "function") {
        const v = this.getValue();
        title = title({ v });
      }

      // allow extend from parent
      if (allowSidebarExtendFromParent && this.props.toolbarExtend) {
        const { getSidebarTitle } = this.props.toolbarExtend as ToolbarExtend;

        title = getSidebarTitle() || title;
      }

      // allow extend from child
      if (allowSidebarExtendFromChild && this.childToolbarExtend) {
        const { getSidebarTitle } = this.childToolbarExtend;

        title = getSidebarTitle() || title;
      }

      return title || "";
    };

    return {
      getItems,
      getSidebarItems,
      getSidebarTitle,
      onBeforeOpen: (): void => {
        global.Brizy.activeEditorComponent = this;
      },
      onBeforeClose: (): void => {
        global.Brizy.activeEditorComponent = null;
      },
      onOpen: onToolbarOpen,
      onClose: onToolbarClose,
      onMouseEnter: onToolbarEnter,
      onMouseLeave: onToolbarLeave
    };
  }

  /**
   * @param {object} v
   * @param {string} device
   * @param {string} state
   * @param {object[]} items
   * @return {object[]}
   */
  bindToolbarItems(
    v: M,
    device: Responsive.ResponsiveMode,
    state: State.State,
    items: ToolbarItemType[]
  ): OptionDefinition[] {
    const getKey = (id: string, key: string, isDev: boolean) => {
      return id === "tabsState" || !isDev
        ? id
        : defaultValueKey({
            key: createOptionId(id, key),
            device,
            state
          });
    };

    return optionMap((option) => {
      const { id, type, onChange: oldOnchange } = option;

      if (Responsive.empty === device) {
        // Apply state mode only in desktop device mode
        option = bindStateToOption(GlobalState.states, option);
      }

      //TODO: Remove `inDev` and `defaultOnChange` after migrating all option to the new format
      const isDev = inDevelopment(type);
      const defaultOnChange = (id: keyof M, v: Literal): Partial<M> | null =>
        v !== undefined ? ({ [id]: v } as Partial<M>) : null;
      const deps = option.dependencies || _.identity;

      if (isDev) {
        option.value = fromElementModel(type)((key) =>
          defaultValueValue({
            v,
            key: createOptionId(id, key),
            device,
            state
          })
        );
      }

      const elementModel = toElementModel<typeof type>(type, (key) =>
        getKey(id, key, isDev)
      );

      option.onChange = (value: ElementModel | Literal, meta: Meta): void => {
        const id = getKey(option.id, "", isDev);
        const patch: Partial<Model<M>> = isDev
          ? deps(elementModel(value))
          : oldOnchange
          ? oldOnchange(value, meta)
          : defaultOnChange(id, value as Literal);

        if (patch) {
          if (process.env.NODE_ENV === "development") {
            this.validatePatch(patch, option, state, device);
          }
          this.patchValue(patch);
        }
      };

      return option;
    }, optionMap(wrapOption, items));
  }

  makeToolbarPropsFromConfig2(
    config: NewToolbarConfig<M, P, S>,
    sidebarConfig?: SidebarConfig<M, P, S>,
    options = {}
  ): ToolbarExtend {
    const { onToolbarOpen, onToolbarClose, onToolbarEnter, onToolbarLeave } =
      this.props;
    const {
      allowExtendFromParent,
      parentItemsFilter,
      parentExtendProp = "toolbarExtend",
      allowExtendFromChild,
      allowExtendFromThirdParty,
      thirdPartyExtendId = this.getComponentId(),

      // sidebar
      allowSidebarExtendFromParent,
      allowSidebarExtendFromChild,
      allowSidebarExtendFromThirdParty,
      sidebarThirdPartyExtendId = thirdPartyExtendId
    } = makeToolbarPropsFromConfigDefaults(options);

    // WARNING: we use getStore instead of this.getReduxState()
    // because the page does not rerender when changing deviceMode
    // and thus we might get false (outdated) results
    const getItems = (
      deviceMode = deviceModeSelector(getStore().getState())
    ): OptionDefinition[] => {
      if (process.env.NODE_ENV === "development") {
        if (!config.getItems) {
          // eslint-disable-next-line no-console
          console.warn(
            `${this.getComponentId()}. getItems not found in toolbarConfig`
          );
        }
      }

      const v = this.getValue();
      const stateMode = State.mRead(v.tabsState);

      let items = this.bindToolbarItems(
        v,
        deviceMode,
        stateMode,
        config?.getItems({
          v,
          component: this,
          device: deviceMode,
          state: stateMode,
          context: this.context
        }) ?? []
      );

      // allow extend from parent
      if (
        allowExtendFromParent &&
        this.props[parentExtendProp as keyof Props<M, P>]
      ) {
        const { getItems } = this.props[
          parentExtendProp as keyof Props<M, P>
        ] as ToolbarExtend;
        let extendItems = getItems(deviceMode);

        if (typeof parentItemsFilter === "function") {
          extendItems = parentItemsFilter(extendItems);
        }

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (allowExtendFromChild && this.childToolbarExtend) {
        const { getItems } = this.childToolbarExtend;
        const extendItems = getItems(deviceMode);

        items = mergeOptions(extendItems, items);
      }

      // allow extend from third party
      if (allowExtendFromThirdParty) {
        const thirdPartyConfig = applyFilter(
          `toolbarItemsExtend_${thirdPartyExtendId}`,
          null
        );

        if (thirdPartyConfig?.getItems) {
          const thirdPartyItems = this.bindToolbarItems(
            v,
            deviceMode,
            stateMode,
            thirdPartyConfig.getItems({
              v,
              component: this,
              device: deviceMode,
              state: stateMode,
              context: this.context
            })
          );

          items = mergeOptions(items, thirdPartyItems);
        }
      }

      return items;
    };

    const getSidebarItems = (
      deviceMode = deviceModeSelector(getStore().getState())
    ): OptionDefinition[] => {
      const v = this.getValue();
      const stateMode = State.mRead(v.tabsState);
      let items = this.bindToolbarItems(
        v,
        deviceMode,
        stateMode,
        sidebarConfig?.getItems?.({
          v,
          component: this,
          device: deviceMode,
          state: stateMode,
          context: this.context
        }) || []
      );

      // allow extend from parent
      if (
        allowSidebarExtendFromParent &&
        (this.props[parentExtendProp as keyof Props<M, P>] as ToolbarExtend)
          ?.getSidebarItems
      ) {
        const { getSidebarItems } = this.props[
          parentExtendProp as keyof Props<M, P>
        ] as ToolbarExtend;
        const extendItems = getSidebarItems(deviceMode);

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (allowSidebarExtendFromChild && this.childToolbarExtend) {
        const { getSidebarItems } = this.childToolbarExtend;
        const extendItems = getSidebarItems(deviceMode);

        items = mergeOptions(extendItems, items);
      }

      // allow extend from third party
      if (allowSidebarExtendFromThirdParty) {
        const thirdPartyConfig = applyFilter(
          `sidebarItemsExtend_${sidebarThirdPartyExtendId}`,
          null
        );

        if (thirdPartyConfig?.getItems) {
          const thirdPartyItems = this.bindToolbarItems(
            v,
            deviceMode,
            stateMode,
            thirdPartyConfig.getItems({
              v,
              component: this,
              device: deviceMode,
              state: stateMode,
              context: this.context
            })
          );

          items = mergeOptions(items, thirdPartyItems);
        }
      }

      return items;
    };

    const getSidebarTitle = (): string => {
      let title = sidebarConfig?.title;

      if (typeof title === "function") {
        const v = this.getValue();
        title = title({ v });
      }

      // allow extend from parent
      if (allowSidebarExtendFromParent && this.props.toolbarExtend) {
        const { getSidebarTitle } = this.props.toolbarExtend as ToolbarExtend;

        title = getSidebarTitle() || title;
      }

      // allow extend from child
      if (allowSidebarExtendFromChild && this.childToolbarExtend) {
        const { getSidebarTitle } = this.childToolbarExtend;

        title = getSidebarTitle() || title;
      }

      return title || "";
    };

    return {
      getItems,
      getSidebarItems,
      getSidebarTitle,
      onBeforeOpen: (): void => {
        global.Brizy.activeEditorComponent = this;
      },
      onBeforeClose: (): void => {
        global.Brizy.activeEditorComponent = null;
      },
      onOpen: onToolbarOpen,
      onClose: onToolbarClose,
      onMouseEnter: onToolbarEnter,
      onMouseLeave: onToolbarLeave
    };
  }

  render(): ReactNode {
    const { v, vs, vd } = this.getValue2();

    if (IS_EDITOR) {
      return this.renderForEdit(v, vs, vd);
    }

    if (IS_PREVIEW) {
      return this.renderForView(v, vs, vd);
    }
  }

  renderForEdit(v: M, vs: M, vd: M): ReactNode {
    throw new Error("renderForEdit: Not Implemented" + v + vs + vd);
  }

  renderForView(v: M, vs: M, vd: M): ReactNode {
    return this.renderForEdit(v, vs, vd);
  }

  // experimental
  applyRulesToValue(value: M, rules: (false | Rule)[]): M {
    const filteredRules = rules.filter(Boolean) as Rule[];

    if (filteredRules.length === 0) {
      return value;
    }

    const rulesValue = this.getRulesValue(filteredRules);

    return _.defaults(rulesValue, value);
  }

  getRulesValue(rules: Rule[]): MValue<{ [k: string]: Rule }> {
    const currentStyleRules = rulesSelector(this.getReduxState());

    if (!currentStyleRules) {
      return undefined;
    }

    return rules.reduce((acc, rule) => {
      let overrides;

      switch (typeof rule) {
        case "object": {
          const { rule: ruleName, mapper } = rule;

          overrides =
            currentStyleRules[ruleName] && mapper(currentStyleRules[ruleName]);
          break;
        }
        case "string": {
          overrides = currentStyleRules[rule];
          break;
        }
        default:
          throw new Error("Invalid rule type");
      }

      return overrides ? Object.assign(acc, overrides) : acc;
    }, {});
  }
}

export default EditorComponent;

export type EditorInstance = typeof EditorComponent;

export type Editor<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> = EditorComponent<M, P, S>;
