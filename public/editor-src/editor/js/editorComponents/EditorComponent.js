import React from "react";
import _ from "underscore";
import { mergeOptions, optionTraverse } from "visual/component/Options/utils";
import { uuid } from "visual/utils/uuid";
import { getStore } from "visual/redux/store";
import { rulesSelector, deviceModeSelector } from "visual/redux/selectors";
import { applyFilter } from "visual/utils/filters";
import { objectFlat } from "visual/utils/object";

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
    if (process.env.NODE_ENV === "development") {
      this.validateValue(patch);
    }

    return { ...this.getDBValue(), ...patch };
  }

  handleValueChange(newValue, meta) {
    this.props.onChange(newValue, meta);
  }

  validateValue(newValue) {
    const defaultValueKeys = Object.keys(this.getDefaultValue());
    const newValueKeys = Object.keys(_.omit(newValue, "_id", "_styles"));
    const newValueDiffKeys = _.difference(newValueKeys, defaultValueKeys);

    if (newValueDiffKeys.length > 0) {
      const msg = [
        `${this.constructor.name}.validateValue() called with value`,
        `that contains keys [${newValueDiffKeys}]`,
        `that are not specified in ${this.constructor.name}.defaultValue`
      ].join("\n");

      throw new Error(msg);
    }
  }

  selfDestruct() {
    this.props.onChange(null);
  }

  makeSubcomponentProps({ bindWithKey, ...otherProps }) {
    if (process.env.NODE_ENV === "development") {
      if (!(bindWithKey in this.getDefaultValue())) {
        console.error(
          "Invalid value: %s for bindWithKey. Check that %s.getDefaultValue() contains the key %s",
          bindWithKey,
          this.constructor.name,
          bindWithKey
        );
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
    {
      allowExtend = true,
      allowExtendParent = null,
      allowExtendChild = null,
      extendFilter = null,
      filterExtendName = null
    } = {} /* options */
  ) {
    const {
      onToolbarOpen,
      onToolbarClose,
      onToolbarEnter,
      onToolbarLeave
    } = this.props;

    // WARNING: we use getStore instead of this.getReduxState()
    // because the page does not rerender when changing deviceMode
    // and thus we might get false (outdated) results
    const getItems = (deviceMode = getStore().getState().ui.deviceMode) => {
      const getItemsFnName = `getItemsFor${capitalize(deviceMode, true)}`;

      if (process.env.NODE_ENV === "development") {
        if (!config[getItemsFnName]) {
          console.warn(
            `${
              this.constructor.componentId
            }. ${getItemsFnName} not found in toolbarConfig`
          );
        }
      }

      const getItemsFn = config[getItemsFnName];
      const v = this.getValue();
      let items = this.bindToolbarItems(getItemsFn ? getItemsFn(v, this) : []);

      // allow extend from parent
      if (
        (allowExtendParent !== null ? allowExtendParent : allowExtend) &&
        this.props.toolbarExtend
      ) {
        const { getItems } = this.props.toolbarExtend;
        let extendItems = getItems(deviceMode);

        if (extendFilter) {
          extendItems = extendFilter(extendItems);
        }

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (
        (allowExtendChild !== null ? allowExtendChild : allowExtend) &&
        this.childToolbarExtend
      ) {
        const { getItems } = this.childToolbarExtend;
        const extendItems = getItems(deviceMode);

        items = mergeOptions(items, extendItems);
      }

      // allow extend from filter
      const filterToolbarExtend = applyFilter(
        `toolbarItemsExtend_${filterExtendName ||
          this.constructor.componentId}`,
        null
      );
      if (filterToolbarExtend && filterToolbarExtend[getItemsFnName]) {
        const filterItems = this.bindToolbarItems(
          filterToolbarExtend[getItemsFnName](v, this)
        );

        items = mergeOptions(items, filterItems);
      }

      return items;
    };

    return {
      getItems,
      onBeforeOpen: () => (global.Brizy.activeEditorComponent = this),
      onBeforeClose: () => (global.Brizy.activeEditorComponent = null),
      onOpen: onToolbarOpen,
      onClose: onToolbarClose,
      onMouseEnter: onToolbarEnter,
      onMouseLeave: onToolbarLeave
    };
  }

  bindToolbarItems(items) {
    optionTraverse(items, option => {
      const id = option.id;
      const oldOnchange = option.onChange;

      option.onChange = (value, meta) => {
        let patch = oldOnchange
          ? oldOnchange(value, meta)
          : value !== undefined
          ? { [id]: value }
          : null;

        if (patch) {
          this.patchValue(patch);
        }
      };
    });

    return items;
  }

  makeToolbarPropsFromConfig2(
    config,
    {
      allowExtend = true,
      allowExtendParent = null,
      allowExtendChild = null,
      extendFilter = null,
      filterExtendName = null
    } = {} /* options */
  ) {
    const {
      onToolbarOpen,
      onToolbarClose,
      onToolbarEnter,
      onToolbarLeave
    } = this.props;

    // WARNING: we use getStore instead of this.getReduxState()
    // because the page does not rerender when changing deviceMode
    // and thus we might get false (outdated) results
    const getItems = (
      deviceMode = deviceModeSelector(getStore().getState())
    ) => {
      if (process.env.NODE_ENV === "development") {
        if (!config.getItems) {
          console.warn(
            `${
              this.constructor.componentId
            }. getItems not found in toolbarConfig`
          );
        }
      }

      const v = this.getValue();
      let items = this.bindToolbarItems(
        config.getItems
          ? config.getItems({
              v,
              component: this,
              device: deviceMode
            })
          : []
      );

      // allow extend from parent
      if (
        (allowExtendParent !== null ? allowExtendParent : allowExtend) &&
        this.props.toolbarExtend
      ) {
        const { getItems } = this.props.toolbarExtend;
        let extendItems = getItems(deviceMode);

        if (extendFilter) {
          extendItems = extendFilter(extendItems);
        }

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (
        (allowExtendChild !== null ? allowExtendChild : allowExtend) &&
        this.childToolbarExtend
      ) {
        const { getItems } = this.childToolbarExtend;
        const extendItems = getItems(deviceMode);

        items = mergeOptions(items, extendItems);
      }

      // allow extend from filter
      const filterToolbarExtend = applyFilter(
        `toolbarItemsExtend_${filterExtendName ||
          this.constructor.componentId}`,
        null
      );
      if (filterToolbarExtend && filterToolbarExtend.getItems) {
        const filterItems = this.bindToolbarItems(
          filterToolbarExtend.getItems({
            v,
            component: this,
            device: deviceMode
          })
        );

        items = mergeOptions(items, filterItems);
      }

      return items;
    };

    return {
      getItems,
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

  renderForEdit(v, vs, vd) {
    throw "renderForEdit: Not Implemented";
  }

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
        case "object":
          const { rule: ruleName, mapper } = rule;

          overrides =
            currentStyleRules[ruleName] && mapper(currentStyleRules[ruleName]);
          break;
        case "string":
          overrides = currentStyleRules[rule];
          break;
        default:
          throw new Error("Invalid rule type");
      }

      return overrides ? Object.assign(acc, overrides) : acc;
    }, {});
  }
}

export default EditorComponent;
