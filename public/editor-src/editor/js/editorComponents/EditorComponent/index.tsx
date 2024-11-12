import classNames from "classnames";
import React, { ReactNode } from "react";
import { mergeDeep } from "timm";
import { flatten, identity, noop } from "underscore";
import {
  ElementDefaultValue,
  ElementModel,
  ModelType
} from "visual/component/Elements/Types";
import { OptionName, OptionValue } from "visual/component/Options/types";
import Toolbar from "visual/component/Toolbar";
import {
  Meta,
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { Props as WrapperProps } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import Editor from "visual/global/Editor";
import * as GlobalState from "visual/global/StateMode";
import { deviceModeSelector, rulesSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { WithClassName } from "visual/types/attributes";
import {
  css,
  filterMergedStylesByDevice,
  getInitialV,
  replaceCSSDuplicatesWithEmptyString
} from "visual/utils/cssStyle";
import {
  filterStylesByDevice,
  getCSSObjects
} from "visual/utils/cssStyle/cssStyle2";
import { GeneratedCSS, OutputStyle } from "visual/utils/cssStyle/types";
import {
  addBreakpointsToFilteredCSS,
  concatFinalCSS,
  mergeStylesArray
} from "visual/utils/cssStyle/utils";
import { isPro, IS_PRO } from "visual/utils/env";
import { applyFilter } from "visual/utils/filters";
import { defaultValueKey } from "visual/utils/onChange/device";
import {
  Choices,
  getDynamicContentOption,
  Handler
} from "visual/utils/options/getDynamicContentOption";
import { TypeChoices } from "visual/utils/options/types";
import { mergeOptions, optionMap } from "visual/utils/options/utils";
import { getOptionModel } from "visual/utils/options/utils/fromElementModel";
import { toElementModel } from "visual/utils/options/utils/toElementModel";
import { getOptionMeta } from "visual/utils/options/utils/toMeta/utils";
import { wrapOption } from "visual/utils/options/utils/wrap";
import { attachRef } from "visual/utils/react";
import * as Str from "visual/utils/reader/string";
import * as Responsive from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { NORMAL } from "visual/utils/stateMode";
import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import { Literal } from "visual/utils/types/Literal";
import { uuid } from "visual/utils/uuid";
import { isT, MValue } from "visual/utils/value";
import {
  DCObjResult,
  getDCObjEditor,
  getDCObjPreview
} from "./DynamicContent/getDCObj";
import { dcKeyToKey, isDCKey, keyDCInfo } from "./DynamicContent/utils";
import { EditorComponentContext } from "./EditorComponentContext";
import {
  ComponentsMeta,
  ConfigGetter,
  ContextMenuItem,
  ContextMenuProps,
  DefaultValueProcessed,
  ECDC,
  ECKeyDCInfo,
  Model,
  NewToolbarConfig,
  OnChangeMeta,
  SidebarConfig,
  ToolbarConfig,
  ToolbarExtend
} from "./types";
import {
  createOptionId,
  filterCSSOptions,
  filterProOptions,
  flattenDefaultValue,
  getElementModelKeyFn,
  getOptionValueByDevice,
  getToolbarData,
  inDevelopment,
  makeToolbarPropsFromConfigDefaults
} from "./utils";

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

const tempPatch = new Map<string, Partial<Model<ElementModel>>>();

export class EditorComponent<
  M extends ElementModel = ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> extends React.Component<Props<M, P>, S> {
  /**
   *
   * @type {object}
   */
  static defaultProps = {
    meta: {},
    onToolbarOpen: noop,
    onToolbarClose: noop,
    onToolbarEnter: noop,
    onToolbarLeave: noop
  };
  static defaultValue: ElementDefaultValue = {};
  static experimentalDynamicContent = false;
  static contextType = EditorComponentContext;
  componentConfig: ConfigGetter | undefined;
  _initialToolbarsConfig: ToolbarConfig[] | undefined;
  _defaultToolbarValues: Record<string, unknown> | undefined;
  _DCKeys: Array<string> | undefined;
  _defaultValueProcessedCache?: DefaultValueProcessed<M>;
  _dc: ECDC = {};
  childToolbarExtend?: ToolbarExtend;

  /**
   * @return {string}
   */
  static get componentId(): string {
    throw new Error(`${this.name} must implement \`static get componentId()\``);
  }

  // shouldComponentUpdate(nextProps) {
  //   return this.optionalSCU(nextProps);
  // }

  getValueByOptionId = (id: string): undefined | OptionValue<OptionName> => {
    const v = this.getValue();

    if (!this._initialToolbarsConfig) {
      return;
    }

    return getOptionValueByDevice({
      v,
      id,
      currentDevice: deviceModeSelector(this.getReduxState()),
      toolbarConfig: this._initialToolbarsConfig
    });
  };

  getDCOptionByType = (type: TypeChoices): MValue<Handler | Choices> => {
    return getDynamicContentOption({
      options: this.context.dynamicContent.config,
      type
    });
  };

  getComponentId(): string {
    return (this.constructor as typeof EditorComponent).componentId;
  }

  getComponentConfig = (): MValue<C> => {
    const configId = Str.read(this.getValue().configId);

    if (configId) {
      const shortcode = Editor.getShortcode(configId);

      if (shortcode) {
        return shortcode?.component?.config as C;
      }
    }
  };

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

  processToolbarValues(): void {
    if (!this.componentConfig?.getConfig) {
      return;
    }

    if (!this._defaultToolbarValues && !this._DCKeys) {
      const toolbars = this.componentConfig.getConfig({
        // When we start to create the defaultValue the Getter always return undefined
        // because at the first time we don't have the value
        getValue: () => undefined,
        getDCOption: () => undefined
      });

      this._initialToolbarsConfig = toolbars;

      toolbars.forEach(({ toolbar, sidebar }) => {
        const toolbarData = getToolbarData(toolbar);
        const sidebarData = getToolbarData(sidebar);

        this._defaultToolbarValues = {
          ...this._defaultToolbarValues,
          ...toolbarData.dv,
          ...sidebarData.dv
        };

        this._DCKeys = [
          ...(this._DCKeys ?? []),
          ...(toolbarData.DCKeys ?? []),
          ...(sidebarData.DCKeys ?? [])
        ];
      });
    }
  }

  getDefaultValue(): M {
    let defaultValueFlat = this.getDefaultValueProcessed().defaultValueFlat;

    if (!this._defaultToolbarValues) {
      this.processToolbarValues();
    }

    defaultValueFlat = { ...defaultValueFlat, ...this._defaultToolbarValues };

    return this.props.defaultValue
      ? { ...defaultValueFlat, ...this.props.defaultValue } // allows defaultValue overriding
      : defaultValueFlat;
  }

  getDefaultValueProcessed(): DefaultValueProcessed<M> {
    if (this._defaultValueProcessedCache) {
      return this._defaultValueProcessedCache;
    }

    const defaultValue = (this.constructor as typeof EditorComponent)
      .defaultValue;
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
    // this.getId() not working
    const _id = this.props._id || this.props.dbValue._id;
    const _tempPatch = _id ? tempPatch.get(_id) : undefined;

    if (_tempPatch) {
      return mergeDeep(this.props.dbValue, _tempPatch) as Props<
        M,
        P
      >["dbValue"];
    } else {
      return this.props.dbValue;
    }
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

  getToolbarOptions = (
    currentModel: ModelType,
    toolbars: NewToolbarConfig<M, P, S>[]
  ): ToolbarItemType[] => {
    const v = getInitialV<M>(currentModel, this.getValue2());
    const { tabsState } = v;

    return flatten(
      toolbars.map((toolbar) =>
        toolbar.getItems({
          v,
          device: deviceModeSelector(this.getReduxState()),
          state: State.fromString(Str.read(tabsState) ?? "") ?? NORMAL,
          context: this.context,
          component: this as Editor<M, P, S>,
          getValue: this.getValueByOptionId
        })
      )
    );
  };

  getFilteredToolbarOptions = (
    currentModel: ModelType,
    toolbars: NewToolbarConfig<M, P, S>[],
    sidebars?: NewToolbarConfig<M, P, S>[]
  ): ToolbarItemType[] => {
    const config = Config.getAll();
    const thirdPartyExtendId = this.getComponentId();

    const toolbarFreeOptions = this.getToolbarOptions(currentModel, toolbars);
    const toolbarPro = applyFilter(
      `toolbarItemsExtend_${thirdPartyExtendId}`,
      null
    );
    const toolbarProOptions = this.getToolbarOptions(
      currentModel,
      toolbarPro ? [toolbarPro] : []
    );
    const toolbarOptions = [...toolbarFreeOptions, ...toolbarProOptions];

    const sidebarFreeOptions =
      sidebars && sidebars.length
        ? this.getToolbarOptions(currentModel, sidebars)
        : [];
    const sidebarPro = applyFilter(
      `sidebarItemsExtend_${thirdPartyExtendId}`,
      null
    );
    const sidebarProOptions = this.getToolbarOptions(
      currentModel,
      sidebarPro ? [sidebarPro] : []
    );
    const sidebarOptions = [...sidebarFreeOptions, ...sidebarProOptions];

    const options = filterCSSOptions(
      [...toolbarOptions, ...sidebarOptions]
        .map(filterProOptions(isPro(config)))
        .filter(isT)
    );

    return options.filter((o) => o.disabled !== true);
  };

  getCSS({
    toolbars,
    sidebars,
    model
  }: {
    toolbars: NewToolbarConfig<M, P, S>[];
    sidebars?: NewToolbarConfig<M, P, S>[];
    model: {
      v: M;
      vs: M;
      vd: M;
    };
  }): OutputStyle {
    const defaultOptions = this.getFilteredToolbarOptions(
      ModelType.Default,
      toolbars,
      sidebars
    );
    const rulesOptions = this.getFilteredToolbarOptions(
      ModelType.Rules,
      toolbars,
      sidebars
    );
    const customOptions = this.getFilteredToolbarOptions(
      ModelType.Custom,
      toolbars,
      sidebars
    );

    const defaultCSSObj = getCSSObjects({
      currentModel: ModelType.Default,
      model,
      options: defaultOptions
    });

    const rulesCSSObj = getCSSObjects({
      currentModel: ModelType.Rules,
      model,
      options: rulesOptions
    });
    const customCSSObj = getCSSObjects({
      currentModel: ModelType.Custom,
      model,
      options: customOptions
    });

    const css: [
      GeneratedCSS<string>,
      GeneratedCSS<string>,
      GeneratedCSS<string>
    ] = [
      filterMergedStylesByDevice(
        mergeStylesArray(filterStylesByDevice(defaultCSSObj))
      ),
      filterMergedStylesByDevice(
        mergeStylesArray(filterStylesByDevice(rulesCSSObj))
      ),
      filterMergedStylesByDevice(
        mergeStylesArray(filterStylesByDevice(customCSSObj))
      )
    ];

    const output = addBreakpointsToFilteredCSS(css);

    return replaceCSSDuplicatesWithEmptyString(output);
  }

  getCSSClassnames({
    toolbars,
    sidebars,
    stylesFn,
    extraClassNames
  }: {
    toolbars: NewToolbarConfig<M, P, S>[];
    sidebars?: NewToolbarConfig<M, P, S>[];
    stylesFn?: (v: M, vs: M, vd: M) => OutputStyle;
    extraClassNames?: Array<string | Record<string, boolean>>;
  }) {
    const model = this.getValue2();
    const { v, vs, vd } = model;

    const cssFromStylesFn =
      typeof stylesFn === "function" ? stylesFn(v, vs, vd) : undefined;

    const cssFromToolbarOptions = this.getCSS({ toolbars, sidebars, model });

    const _css = cssFromStylesFn
      ? concatFinalCSS(cssFromStylesFn, cssFromToolbarOptions)
      : cssFromToolbarOptions;

    return classNames(
      extraClassNames,
      css(this.getComponentId(), this.getId(), _css)
    );
  }

  getDCValue(v: M): DCObjResult {
    const _config = Config.getAll();
    const DCKeys = [
      ...this.getDefaultValueProcessed().dynamicContentKeys,
      ...(this._DCKeys ?? [])
    ];
    const getDCObjKeys: ECKeyDCInfo[] = [];

    for (const key of DCKeys) {
      const dcInfo = keyDCInfo(v, key);

      if (dcInfo.hasDC) {
        getDCObjKeys.push(dcInfo);
      }
    }

    const dcObjKeysAfterHook = this.getDCValueHook(getDCObjKeys, v);
    const replaceDC =
      typeof _config.dynamicContent?.getPlaceholderData === "function";

    // Can be disabled by Config
    if (!replaceDC || IS_PREVIEW) {
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
    item: OptionDefinition,
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
    return optionMap(
      (option: OptionDefinition) => {
        const { id, type, onChange: oldOnchange } = option;

        const getKey = getElementModelKeyFn({ device, state, option });

        option = bindStateToOption(GlobalState.states, option, device);

        //TODO: Remove `inDev` and `defaultOnChange` after migrating all option to the new format
        const isDev = inDevelopment(type);
        const defaultOnChange = (id: keyof M, v: Literal): Partial<M> | null =>
          v !== undefined ? ({ [id]: v } as Partial<M>) : null;
        const deps = option.dependencies || identity;

        if (isDev) {
          const optionModel = getOptionModel({
            id,
            type,
            v,
            breakpoint: device,
            state
          });

          option.meta = getOptionMeta(type, optionModel);

          option.value = optionModel;
        }

        const elementModel = toElementModel<typeof type>(type, getKey);

        option.onChange =
          option.isPro === true && !IS_PRO
            ? noop
            : (value, meta): void => {
                const id = getKey("");
                const patch: Partial<Model<M>> | null | void = isDev
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
      },
      optionMap(wrapOption, items)
    );
  }

  makeToolbarPropsFromConfig2(
    config: NewToolbarConfig<M, P, S, C>,
    sidebarConfig?: SidebarConfig<M, P, S, C>,
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
          context: this.context,
          getValue: this.getValueByOptionId,
          componentConfig: this.getComponentConfig()
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
          context: this.context,
          getValue: this.getValueByOptionId
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

  renderToolbars(children: ReactNode): ReactNode {
    if (!this.componentConfig?.getConfig) {
      return children;
    }

    const toolbars = this.componentConfig.getConfig({
      getValue: this.getValueByOptionId,
      getDCOption: this.getDCOptionByType
    });

    const generate = (
      toolbars: ToolbarConfig[],
      child: ReactNode
    ): ReactNode => {
      if (!toolbars.length) {
        return child;
      } else {
        const [toolbarData, ...rest] = toolbars;
        const { selector, toolbar, sidebar } = toolbarData;

        const toolbarProps = this.makeToolbarPropsFromConfig2(
          { getItems: () => toolbar ?? [] },
          { getItems: () => sidebar ?? [] }
        );

        const html = (
          <Toolbar selector={selector} {...toolbarProps}>
            <>{child}</>
          </Toolbar>
        );

        return generate(rest, html);
      }
    };

    return generate(toolbars, children);
  }

  render(): ReactNode {
    const { v, vs, vd } = this.getValue2();

    if (IS_EDITOR) {
      if (this.componentConfig) {
        return this.renderToolbars(this.renderForEdit(v, vs, vd));
      }
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
}

export default EditorComponent;

export type EditorInstance = typeof EditorComponent;

export type Editor<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> = EditorComponent<M, P, S, C>;
