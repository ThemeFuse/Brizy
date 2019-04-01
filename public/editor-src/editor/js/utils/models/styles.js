import { getIn, setIn } from "timm";
import Editor from "visual/global/Editor";

export function getElementOfArrayLoop(list, currentValue, operation) {
  let currentIndex = list.findIndex(item => item === currentValue);

  let newIndex = operation === "increase" ? ++currentIndex : --currentIndex;
  if (newIndex === list.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = list.length - 1;
  }

  return list[newIndex];
}

export function getParentWhichContainsStyleProperty(path, value, property) {
  return getClosestParent(path, value, v => {
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

export function getStyles(value) {
  const { defaultValue } = Editor.getComponent(value.type);

  return defaultValue.style;
}

export function setStyles(componentValue, depth = 0, i = 0) {
  const styles = getStyles(componentValue);

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
      return setStyles(
        {
          ...item,
          value: {
            ...newItem.value,
            ...item.value
          }
        },
        depth,
        i
      );
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
