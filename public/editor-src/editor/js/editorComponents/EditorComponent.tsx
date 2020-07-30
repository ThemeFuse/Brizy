import React, { Component, ReactNode } from "react";
import _ from "underscore";
import classNames from "classnames";
import { mergeOptions, optionMap } from "visual/component/Options/utils";
import { uuid } from "visual/utils/uuid";
import { getStore } from "visual/redux/store";
import { rulesSelector, deviceModeSelector } from "visual/redux/selectors";
import { applyFilter } from "visual/utils/filters";
import { objectFlat } from "visual/utils/object";
import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import {
  defaultValueKey,
  defaultValueValue
} from "visual/utils/onChange/device";
import * as State from "visual/utils/stateMode";
import * as Responsive from "visual/utils/responsiveMode";
import {
  createOptionId,
  inDevelopment,
  optionMode,
  optionState,
  setOptionPrefix,
  makeToolbarPropsFromConfigDefaults
} from "./utils";
import { getModel } from "visual/component/Options/types";
import { wrapOption } from "visual/utils/options/utils";
import {
  DynamicContentObjIncomplete,
  DynamicContentObj,
  getDynamicContentObj
} from "visual/component/DynamicContent/getDynamicContentObj";
import { ElementModel } from "visual/component/Elements/Types";
import * as Str from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { OptionDefinition } from "visual/component/Options/Type";
import { MValue } from "visual/utils/value";
import { WithClassName } from "visual/utils/options/attributes";
import { Props as WrapperProps } from "visual/editorComponents/tools/Wrapper";
import { ReduxState } from "visual/redux/types";

const capitalize = ([first, ...rest]: string, lowerRest = false): string =>
  first.toUpperCase() +
  (lowerRest ? rest.join("").toLowerCase() : rest.join(""));

type Rule = string | { rule: string; mapper: Function };

type Model<M> = M & {
  _id?: string;
  _styles?: string[];
  tabsState?: State.State;
};

type DefaultValueProcessed = {
  dynamicContentKeys: [string, string][];
};

type Meta = MValue<{ [k: string]: unknown }>;
type OnChangeMeta<M> = Meta & {
  patch?: Partial<Model<M>>;
  intent?: "replace_all" | "remove_all";
};

type ContextMenuItem = {
  id: string;
  type: "group" | "button";
  title: string;
  icon?: string;
  items?: ContextMenuItem[];
};

type ContextMenuProps = {
  id: string;
  componentId: string;
  items: ContextMenuItem[];
};

type SidebarConfig<M> = {
  getItems: (d: {
    v: M;
    component: Component;
    device: Responsive.ResponsiveMode;
    state: State.State;
  }) => ToolbarItemType[];
  title?: string | ((d: { v: M }) => string);
};

type NewToolbarConfig<M> = {
  getItems: (d: {
    v: M;
    device: Responsive.ResponsiveMode;
    state: State.State;
    component: Component;
  }) => ToolbarItemType[];
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
  onBeforeOpen: () => void;
  onBeforeClose: () => void;
  onOpen: () => void;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export type Props<M extends ElementModel, P> = WithClassName & {
  _id: string;
  dbValue: Model<M>;
  defaultValue: Model<M>;
  path: string[];
  reduxState: ReduxState;
  reduxDispatch: unknown;
  onChange: {
    (v: M | null, meta: OnChangeMeta<M>): void;
  };
  onToolbarOpen: () => void;
  onToolbarClose: () => void;
  onToolbarEnter: () => void;
  onToolbarLeave: () => void;
  toolbarExtend?: ToolbarExtend;
  wrapperExtend?: WrapperProps<P>;
} & P;

export class EditorComponent<
  M extends ElementModel,
  P = {}
> extends React.Component<Props<M, P>> {
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
    onToolbarOpen: _.noop,
    onToolbarClose: _.noop,
    onToolbarEnter: _.noop,
    onToolbarLeave: _.noop
  };

  static defaultValue: ElementModel = {};

  static experimentalDynamicContent = false;

  _defaultValueProcessedCache?: DefaultValueProcessed;

  _dynamicContentPending?: DynamicContentObjIncomplete;

  childToolbarExtend?: ToolbarExtend;

  makeWrapperProps = (props: Partial<WrapperProps<P>>): WrapperProps<P> => {
    const extend = this.props.wrapperExtend ?? ({} as WrapperProps<P>);
    const className = classNames(extend.className, props.className);
    const attributes = {
      ...(extend.attributes || {}),
      ...(props.attributes || {})
    } as P;

    return {
      ...extend,
      ...props,
      className,
      attributes
    };
  };

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
    if (
      props.reduxState.currentStyleId !== nextProps.reduxState.currentStyleId
    ) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (props.reduxState.currentStyle !== nextProps.reduxState.currentStyle) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (
      props.reduxState.extraFontStyles !== nextProps.reduxState.extraFontStyles
    ) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (props.reduxState.fonts !== nextProps.reduxState.fonts) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (props.reduxState.copiedElement !== nextProps.reduxState.copiedElement) {
      return true;
    }

    // check path
    const curPath = props.path || [];
    const nextPath = nextProps.path || [];
    if (curPath.length !== nextPath.length) {
      // console.log("scu", this.constructor.componentId, "path", true);
      return true;
    }
    for (let i = 0, len = curPath.length; i < len; i++) {
      if (curPath[i] !== nextPath[i]) {
        // console.log("scu", this.constructor.componentId, "path", true);
        return true;
      }
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

    return this.props._id || Str.mRead(this.getDBValue()._id) || raiseError();
  }

  getPath(): string[] {
    return this.props.path || [];
  }

  getReduxState(): Props<M, P>["reduxState"] {
    return this.props.reduxState;
  }

  getReduxDispatch(): Props<M, P>["reduxDispatch"] {
    return this.props.reduxDispatch;
  }

  getDefaultValue(): M {
    const newDefaultValue = objectFlat(
      (this.constructor as typeof EditorComponent).defaultValue
    ) as M;

    return this.props.defaultValue
      ? { ...newDefaultValue, ...this.props.defaultValue } // allows defaultValue overriding
      : newDefaultValue;
  }

  getDefaultValueProcessed(): DefaultValueProcessed {
    if (this._defaultValueProcessedCache) {
      return this._defaultValueProcessedCache;
    }

    const defaultValue = this.getDefaultValue();
    this._defaultValueProcessedCache = {
      dynamicContentKeys: Object.keys(defaultValue).reduce((acc, k) => {
        if (k.endsWith("Population")) {
          acc.push([k.replace("Population", ""), k]);
        }

        return acc;
      }, [] as [string, string][])
    };

    return this._defaultValueProcessedCache;
  }

  getDBValue(): Props<M, P>["dbValue"] {
    return this.props.dbValue;
  }

  getStylesValue(): ElementModel | null {
    const { _styles } = this.getDBValue() || {};
    const currentStyleRules = rulesSelector(this.getReduxState());

    if (!_styles || !currentStyleRules) {
      return null;
    }

    return _styles.reduce(
      (acc, style) =>
        currentStyleRules[style]
          ? Object.assign(acc, currentStyleRules[style])
          : acc,
      {} as Partial<M>
    );
  }

  getDCValue(v: M): DynamicContentObj {
    const config = this.getDefaultValueProcessed().dynamicContentKeys;

    let hasPlaceholders = false;
    const placeholders: { [k: string]: string } = {};

    for (let i = 0; i < config.length; i++) {
      const [key, dcKey] = config[i];
      const placeholder = Str.read(v[dcKey]);

      if (placeholder) {
        hasPlaceholders = true;
        placeholders[key] = placeholder;
      }
    }

    if (!hasPlaceholders) {
      return {};
    } else {
      const dynamicContent = getDynamicContentObj(placeholders);

      if (dynamicContent.type === "incomplete") {
        this._dynamicContentPending?.abortGetComplete();

        // some dynamic content isn't ready yet,
        // we wait then rerender to get the rest
        this._dynamicContentPending = dynamicContent;
        this._dynamicContentPending
          .getComplete()
          .then(() => {
            this._dynamicContentPending = undefined;
            this.forceUpdate();
          })
          .catch(() => {
            // aborted, do nothing
          });

        return dynamicContent.partial;
      } else {
        return dynamicContent.obj;
      }
    }
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

  validateValue(value: Model<M>): void {
    const defaultValue = this.getDefaultValue();
    const missingKeys = Object.keys(value).filter(k => {
      const isInDefaultValue = k in defaultValue;
      const isCoreKey = k[0] === "_" || ["tabsState"].includes(k);
      const isLegacyKey = ["tabsCurrentElement"].includes(k);

      return !isInDefaultValue && !isCoreKey && !isLegacyKey;
    });

    if (missingKeys.length) {
      console.error(
        `${
          (this.constructor as typeof EditorComponent).componentId
        } element\n\nKeys not in defaultValue:\n${JSON.stringify(
          missingKeys,
          null,
          2
        )}
        \nTried to update with:\n${JSON.stringify(
          value,
          (k, v) => (Array.isArray(v) ? "[...]" : v),
          2
        )}`
      );
    }
  }

  handleValueChange(newValue: Model<M>, meta: OnChangeMeta<M>): void {
    if (process.env.NODE_ENV === "development") {
      this.validateValue(newValue);
    }

    this.props.onChange(newValue, meta);
  }

  selfDestruct(): void {
    this.props.onChange(null, { intent: "remove_all" });
  }

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
      _id: `${this.getId()}-${bindWithKey}`,
      path: [...this.getPath(), bindWithKey],
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
  ): ContextMenuProps {
    const componentId = this.getComponentId();
    const v = this.getValue();

    return {
      id: uuid(3),
      componentId,
      items: config.getItems(v, this),
      ...extraProps
    };
  }

  makeToolbarPropsFromConfig(
    config: OldToolbarConfig<M>,
    sidebarConfig?: SidebarConfig<M>,
    options = {} /* options */
  ): ToolbarExtend {
    const {
      onToolbarOpen,
      onToolbarClose,
      onToolbarEnter,
      onToolbarLeave
    } = this.props;
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
    ): ToolbarItemType[] => {
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

      const getItemsFn = config[getItemsFnName] as OldToolbarConfig<
        M
      >[typeof getItemsFnName];
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
          state: stateMode
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.Brizy.activeEditorComponent = this;
      },
      onBeforeClose: (): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
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
    return optionMap(option => {
      const { id, type, onChange: oldOnchange } = option;
      const stateOnChange = (mode: State.State): void =>
        this.patchValue({ tabsState: mode } as Partial<Model<M>>);

      if (Responsive.empty === device) {
        // Apply state mode only in desktop device mode
        option = bindStateToOption(state, stateOnChange, option);
      }

      //TODO: Remove `inDev` and `defaultOnChange` after migrating all option to the new format
      const inDev = inDevelopment(type);
      const defaultOnChange = (id: keyof M, v: Literal): Partial<M> | null =>
        v !== undefined ? ({ [id]: v } as Partial<M>) : null;
      const deps = option.dependencies || _.identity;

      if (inDev) {
        option.id = defaultValueKey({
          key: option.id,
          device: optionMode(device, option),
          state: optionState(state, option)
        });

        option.value = getModel(type)(key => {
          return defaultValueValue({
            v,
            key: createOptionId(id, key),
            device,
            state
          });
        });
      }

      option.onChange = (value: ElementModel | Literal, meta: Meta): void => {
        const patch: Partial<Model<M>> = inDev
          ? deps(setOptionPrefix(option.id, value as ElementModel))
          : oldOnchange
          ? oldOnchange(value, meta)
          : defaultOnChange(option.id, value as Literal);

        if (patch) {
          this.patchValue(patch);
        }
      };

      return option;
    }, optionMap(wrapOption, items));
  }

  makeToolbarPropsFromConfig2(
    config: NewToolbarConfig<M>,
    sidebarConfig: SidebarConfig<M>,
    options = {}
  ): ToolbarExtend {
    const {
      onToolbarOpen,
      onToolbarClose,
      onToolbarEnter,
      onToolbarLeave
    } = this.props;
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
    ): ToolbarItemType[] => {
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
          state: stateMode
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
              state: stateMode
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
          state: stateMode
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.Brizy.activeEditorComponent = this;
      },
      onBeforeClose: (): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
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

  /* eslint-disable no-unused-vars */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderForEdit(v: M, vs: M, vd: M): ReactNode {
    throw "renderForEdit: Not Implemented";
  }
  /* eslint-enabled no-unused-vars */

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
