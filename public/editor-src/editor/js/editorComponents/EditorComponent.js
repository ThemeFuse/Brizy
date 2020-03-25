import React from "react";
import _ from "underscore";
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

const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join("").toLowerCase() : rest.join(""));

export class EditorComponent extends React.Component {
  static get componentId() {
    throw new Error(`${this.name} must implement \`static get componentId()\``);
  }

  static defaultProps = {
    onToolbarOpen: _.noop,
    onToolbarClose: _.noop,
    onToolbarEnter: _.noop,
    onToolbarLeave: _.noop
  };

  // shouldComponentUpdate(nextProps) {
  //   return this.optionalSCU(nextProps);
  // }

  optionalSCU(nextProps) {
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

  getId() {
    const raiseError = () => {
      throw new Error(
        "This should never happen. An initialized component must have a preset id"
      );
    };

    return this.props._id || this.getDBValue()._id || raiseError();
  }

  getPath() {
    return this.props.path || [];
  }

  getReduxState() {
    return this.props.reduxState;
  }

  getReduxDispatch() {
    return this.props.reduxDispatch;
  }

  getDefaultValue() {
    const newDefaultValue = objectFlat(this.constructor.defaultValue);

    return this.props.defaultValue
      ? { ...newDefaultValue, ...this.props.defaultValue } // allows defaultValue overriding
      : newDefaultValue;
  }

  getDBValue() {
    return this.props.dbValue;
  }

  getStylesValue() {
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
      {}
    );
  }

  getValue() {
    const defaultValue = this.getDefaultValue();
    const stylesValue = this.getStylesValue();
    const dbValue = this.getDBValue();

    if (process.env.NODE_ENV === "development") {
      if (!defaultValue) {
        throw new Error("missing default value");
      }
    }

    return dbValue
      ? { ...defaultValue, ...stylesValue, ...dbValue }
      : defaultValue;
  }

  getValue2() {
    const defaultValue = this.getDefaultValue();
    const stylesValue = this.getStylesValue();
    const dbValue = this.getDBValue();

    return {
      v: { ...defaultValue, ...stylesValue, ...dbValue },
      vs: { ...defaultValue, ...stylesValue },
      vd: defaultValue
    };
  }

  patchValue(patch, meta = {}) {
    const newValue = this.makeNewValueFromPatch(patch);

    this.handleValueChange(newValue, {
      ...meta,
      patch
    });
  }

  makeNewValueFromPatch(patch) {
    return { ...this.getDBValue(), ...patch };
  }

  handleValueChange(newValue, meta) {
    this.props.onChange(newValue, meta);
  }

  selfDestruct() {
    this.props.onChange(null);
  }

  makeSubcomponentProps({ bindWithKey, ...otherProps }) {
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
    const onChange = (value, meta) =>
      this.patchValue({ [bindWithKey]: value }, meta);

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

  makeContextMenuProps(config, extraProps = {}) {
    const componentId = this.constructor.componentId;
    const v = this.getValue();

    return {
      id: uuid(3),
      componentId,
      items: config.getItems(v, this),
      ...extraProps
    };
  }

  makeToolbarPropsFromConfig(
    config,
    sidebarConfig = null,
    options = {} /* options */
  ) {
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
      thirdPartyExtendId = this.constructor.componentId,

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
    ) => {
      const getItemsFnName = `getItemsFor${capitalize(deviceMode, true)}`;

      if (process.env.NODE_ENV === "development") {
        if (!config[getItemsFnName]) {
          // eslint-disable-next-line no-console
          console.warn(
            `${this.constructor.componentId}. ${getItemsFnName} not found in toolbarConfig`
          );
        }
      }

      const getItemsFn = config[getItemsFnName];
      const v = this.getValue();
      const stateMode = v.tabsState;
      let items = this.bindToolbarItems(
        v,
        deviceMode,
        stateMode,
        getItemsFn?.(v, this) ?? []
      );

      // allow extend from parent
      if (allowExtendFromParent && this.props.toolbarExtend) {
        const { getItems } = this.props.toolbarExtend;
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
    ) => {
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
        this.props.toolbarExtend?.getSidebarItems
      ) {
        const { getSidebarItems } = this.props.toolbarExtend;
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

    const getSidebarTitle = () => {
      let title = sidebarConfig?.title;

      // allow extend from parent
      if (allowSidebarExtendFromParent && this.props.toolbarExtend) {
        const { getSidebarTitle } = this.props.toolbarExtend;

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
      onBeforeOpen: () => (global.Brizy.activeEditorComponent = this),
      onBeforeClose: () => (global.Brizy.activeEditorComponent = null),
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
  bindToolbarItems(v, device, state, items) {
    return optionMap(option => {
      const { id, type, onChange: oldOnchange } = option;
      const stateOnChange = mode => this.patchValue({ tabsState: mode });

      if (Responsive.defaultMode() === device) {
        // Apply state mode only in desktop device mode
        option = bindStateToOption(state, stateOnChange, option);
      }

      //TODO: Remove `inDev` and `defaultOnChange` after migrating all option to the new format
      const inDev = inDevelopment(type);
      const defaultOnChange = (id, v) => (v !== undefined ? { [id]: v } : null);
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

      option.onChange = (value, meta) => {
        let patch = inDev
          ? deps(setOptionPrefix(option.id, value))
          : oldOnchange
          ? oldOnchange(value, meta)
          : defaultOnChange(option.id, value);

        if (patch) {
          this.patchValue(patch);
        }
      };

      return option;
    }, optionMap(wrapOption, items));
  }

  makeToolbarPropsFromConfig2(config, sidebarConfig = null, options = {}) {
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
      thirdPartyExtendId = this.constructor.componentId,

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
    ) => {
      if (process.env.NODE_ENV === "development") {
        if (!config.getItems) {
          // eslint-disable-next-line no-console
          console.warn(
            `${this.constructor.componentId}. getItems not found in toolbarConfig`
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
      if (allowExtendFromParent && this.props[parentExtendProp]) {
        const { getItems } = this.props[parentExtendProp];
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
    ) => {
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
        this.props[parentExtendProp]?.getSidebarItems
      ) {
        const { getSidebarItems } = this.props[parentExtendProp];
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

    const getSidebarTitle = () => {
      let title = sidebarConfig?.title;

      // allow extend from parent
      if (allowSidebarExtendFromParent && this.props.toolbarExtend) {
        const { getSidebarTitle } = this.props.toolbarExtend;

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
      onBeforeOpen: () => (global.Brizy.activeEditorComponent = this),
      onBeforeClose: () => (global.Brizy.activeEditorComponent = null),
      onOpen: onToolbarOpen,
      onClose: onToolbarClose,
      onMouseEnter: onToolbarEnter,
      onMouseLeave: onToolbarLeave
    };
  }

  render() {
    const { v, vs, vd } = this.getValue2();

    if (IS_EDITOR) {
      return this.renderForEdit(v, vs, vd);
    }

    if (IS_PREVIEW) {
      try {
        return this.renderForView(v, vs, vd);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          throw e;
        }

        return null;
      }
    }
  }

  /* eslint-disable no-unused-vars */
  renderForEdit(v, vs, vd) {
    throw "renderForEdit: Not Implemented";
  }
  /* eslint-enabled no-unused-vars */

  renderForView(v, vs, vd) {
    return this.renderForEdit(v, vs, vd);
  }

  // experimental
  applyRulesToValue(value, rules) {
    const filteredRules = rules.filter(Boolean);

    if (filteredRules.length === 0) {
      return value;
    }

    const rulesValue = this.getRulesValue(filteredRules);

    return _.defaults(rulesValue, value);
  }

  getRulesValue(rules) {
    const currentStyleRules = rulesSelector(this.getReduxState());

    if (!currentStyleRules) {
      return null;
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
