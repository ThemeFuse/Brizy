import React from "react";
import _ from "underscore";
import {
  mergeOptions,
  optionTraverse
} from "visual/component-new/Options/utils";
import { getStore } from "visual/redux/store";
import { currentStyleSelector } from "visual/redux/selectors";
import { applyFilter } from "visual/utils/filters";

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
    if (props.reduxState.globals !== nextProps.reduxState.globals) {
      // console.log("scu", this.constructor.componentId, "globals", true);
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
    return this.props.defaultValue
      ? { ...this.constructor.defaultValue, ...this.props.defaultValue } // allows defaultValue overriding
      : this.constructor.defaultValue;
  }

  getDBValue() {
    return this.props.dbValue;
  }

  getStylesValue() {
    const { _styles } = this.getDBValue() || {};
    const currentStyleRules = currentStyleSelector(this.getReduxState()).rules;

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

  patchValue(patch, meta) {
    const newValue = this.makeNewValueFromPatch(patch);

    this.handleValueChange(newValue, { patch, meta });
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
      path: [...this.getPath(), bindWithKey],
      defaultValue: defaultValue && defaultValue[bindWithKey],
      dbValue: dbValue && dbValue[bindWithKey],
      reduxState: this.getReduxState(),
      reduxDispatch: this.getReduxDispatch(),
      onChange: onChange
    };
  }

  makeToolbarPropsFromConfig(
    config,
    { allowExtend = true, extendFilter = null } = {} /* options */
  ) {
    const {
      onToolbarOpen,
      onToolbarClose,
      onToolbarEnter,
      onToolbarLeave,
      meta
    } = this.props;

    // WARNING: we use getStore instead of this.getReduxState()
    // because the page does not rerender when changing deviceMode
    // and thus we might get false (outdated) results
    const getItems = (deviceMode = getStore().getState().ui.deviceMode) => {
      const getItemsFnName = `getItemsFor${capitalize(deviceMode, true)}`;

      if (process.env.NODE_ENV === "development") {
        if (!config[getItemsFnName]) {
          throw new Error(`${getItemsFnName} not found in toolbarConfig`);
        }
      }

      const getItemsFn = config[getItemsFnName];
      const v = this.getValue();
      let items = this.bindToolbarItems(getItemsFn(v, this));

      // allow extend from parent
      if (this.props.toolbarExtend && allowExtend) {
        const { getItems } = this.props.toolbarExtend;
        let extendItems = getItems(deviceMode);

        if (extendFilter) {
          extendItems = extendFilter(extendItems);
        }

        items = mergeOptions(items, extendItems);
      }

      // allow extend from child
      if (this.childToolbarExtend && allowExtend) {
        const { getItems } = this.childToolbarExtend;
        const extendItems = getItems(deviceMode);

        items = mergeOptions(items, extendItems);
      }

      // allow extend from filter
      const filterToolbarExtend = applyFilter(
        `toolbarItemsExtend_${this.constructor.componentId}`,
        null
      );
      if (filterToolbarExtend) {
        const filterItems = this.bindToolbarItems(
          filterToolbarExtend[getItemsFnName](v, this)
        );

        items = mergeOptions(items, filterItems);
      }

      return items;
    };

    return {
      getItems,
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

  render() {
    const v = this.getValue();

    if (IS_EDITOR) {
      return this.renderForEdit(v);
    }

    if (IS_PREVIEW) {
      try {
        return this.renderForView(v);
      } catch (e) {
        return null;
      }
    }
  }

  renderForEdit(v) {
    throw "renderForEdit: Not Implemented";
  }

  renderForView(v) {
    return this.renderForEdit(v);
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
    const currentStyleRules = currentStyleSelector(this.getReduxState()).rules;

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
