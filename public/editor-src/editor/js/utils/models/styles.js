import { Obj } from "@brizy/readers";
import { getIn, setIn } from "timm";
import Editor from "visual/global/Editor";
import { DESKTOP, RESPONSIVE } from "visual/utils/devices";
import { flattenDefaultValue } from "visual/utils/models/flattenDefaultValue";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { capByPrefix } from "../string";

const filterKeys = [
  capByPrefix("temp", "tablet"),
  capByPrefix("temp", "mobile"),
  "tablet",
  "mobile"
];

const fontFamilyFlattenDefaultValue = flattenDefaultValue(["families"]);

export function getElementOfArrayLoop(list, currentValue, operation) {
  let currentIndex = list.findIndex((item) => item === currentValue);

  let newIndex = operation === "increase" ? ++currentIndex : --currentIndex;
  if (newIndex === list.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = list.length - 1;
  }

  return list[newIndex];
}

export function getParentWhichContainsStyleProperty(path, value, property) {
  return getClosestParent(path, value, (v) => {
    if (v.type) {
      const { defaultValue } = Editor.getComponent(v.type) || {};

      return defaultValue && defaultValue.style
        ? defaultValue.style[property]
        : false;
    }

    return;
  });
}

export function getClosestParent(path, value, cb) {
  const copiedPath = [...path];

  let newPath = [];
  for (let i = 0; i <= path.length; i++) {
    const newValue = getIn(value, copiedPath);
    const propertyExist = cb(newValue);
    if (propertyExist || propertyExist === null) {
      return { value: newValue, path: copiedPath };
    }

    newPath.unshift(copiedPath.pop());
  }

  return {
    value: null,
    path: null
  };
}

const filterDesktopKeys = (v) => {
  if (!Obj.isObject(v) && !Array.isArray(v)) return;

  const dvv = (key) =>
    defaultValueValue({ v, key, device: DESKTOP, state: NORMAL });

  return Object.keys(v).reduce((acc, key) => {
    if (!filterKeys.some((filterKey) => key.startsWith(filterKey))) {
      acc[key] = dvv(key);
    }
    return acc;
  }, {});
};

const filterResponsiveKeys = (v, deviceMode) => {
  if (!Obj.isObject(v) && !Array.isArray(v)) return;

  const dvv = (key) =>
    defaultValueValue({ v, key, device: RESPONSIVE, state: NORMAL });

  return Object.keys(v).reduce((acc, key) => {
    if (key.startsWith(deviceMode)) {
      acc[key] = dvv(key);
    }
    return acc;
  }, {});
};

export function getStateModeKeys(v) {
  const dvv = (key, state) =>
    defaultValueValue({ v, key, device: DESKTOP, state });

  return Object.keys(v).reduce((stateModeKeys, key) => {
    switch (true) {
      case key.startsWith("hover"):
        stateModeKeys[key] = dvv(key, HOVER);
        break;
      case key.startsWith("active"):
        stateModeKeys[key] = dvv(key, ACTIVE);
        break;
    }
    return stateModeKeys;
  }, {});
}

function getStyles({ value, type }, deviceMode, rules = {}) {
  const { defaultValue } = Editor.getComponent(type);

  const ruleStyles = (value._styles || []).reduce((acc, style) => {
    // Get the rule for the current style
    const rule = Obj.readKey(style)(rules);

    // If the rule is not an object, skip it
    if (!Obj.isObject(rule)) return acc;

    // Filter only allowed style properties based on defaultValue.style
    const allowedKeys = Object.keys(defaultValue.style);
    const filteredValues = Object.fromEntries(
      Object.entries(rule).filter(([key]) => allowedKeys.includes(key))
    );

    return { ...acc, ...filteredValues };
  }, {});

  if (deviceMode === DESKTOP) {
    const stateModeKeys = getStateModeKeys(value);
    const defaultStyleDevice = filterDesktopKeys(defaultValue.style);
    return Object.assign({}, defaultStyleDevice, ruleStyles, stateModeKeys);
  } else {
    const componentStyleDevice = filterResponsiveKeys(value, deviceMode);
    const defaultStyleDevice = filterResponsiveKeys(
      defaultValue.style,
      deviceMode
    );

    return Object.assign(
      {},
      defaultStyleDevice,
      ruleStyles,
      componentStyleDevice
    );
  }
}

export function setStyles(data) {
  const { componentValue, deviceMode, depth = 0, rules } = data;
  let i = data.i ?? 0;
  const styles = fontFamilyFlattenDefaultValue(
    getStyles(componentValue, deviceMode, rules)
  );

  let newValue = setIn(
    componentValue,
    ["value"],
    getCopiedValue(componentValue.value, styles)
  );
  i++;

  if (componentValue.value.items && i <= depth) {
    const newItems = componentValue.value.items.map((item, index) => {
      let newItem = {};
      if (
        newValue.value &&
        newValue.value.items &&
        newValue.value.items[index]
      ) {
        newItem = newValue.value.items[index];
      }
      return setStyles({
        componentValue: {
          ...item,
          value: {
            ...newItem.value,
            ...item.value
          }
        },
        depth,
        i,
        deviceMode,
        rules
      });
    });
    newValue = setIn(newValue, ["value", "items"], newItems);
  }

  return newValue;
}

const getCopiedValue = (value, styles = {}) => {
  return Object.entries(styles).reduce((acc, [key, styleValue]) => {
    acc[key] = key in value ? value[key] : styleValue;
    if (key === "items") {
      // only for elements which have deep defaultValue structure(IconText - as example)
      acc[key] = value.items.map((item, index) => ({
        ...item,
        value: {
          ...getCopiedValue(item.value, styles.items[index].value),
          ...item.value
        }
      }));
    } else {
      acc[key] = key in value ? value[key] : styleValue;
    }

    return acc;
  }, {});
};
