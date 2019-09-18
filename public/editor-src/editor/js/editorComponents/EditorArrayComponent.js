import React from "react";
import deepMerge from "deepmerge";
import { insert, removeAt, replaceAt, setIn, getIn } from "timm";
import Editor from "visual/global/Editor";
import { getStore } from "visual/redux/store";
import {
  pageDataNoRefsSelector,
  copiedElementNoRefsSelector
} from "visual/redux/selectors";
import { updateCopiedElement } from "visual/redux/actions";
import EditorComponent from "./EditorComponent";
import {
  stripSystemKeys,
  setIds,
  setStyles,
  getElementOfArrayLoop,
  getClosestParent,
  getParentWhichContainsStyleProperty
} from "visual/utils/models";

const emptyTarget = value => (Array.isArray(value) ? [] : {});
const clone = (value, options) => deepMerge(emptyTarget(value), value, options);

function combineMerge(target, source, options) {
  const destination = target.slice();
  source.forEach(function(e, i) {
    if (typeof destination[i] === "undefined") {
      const cloneRequested = options.clone !== false;
      const shouldClone = cloneRequested && options.isMergeableObject(e);
      destination[i] = shouldClone ? clone(e, options) : e;
    } else if (options.isMergeableObject(e)) {
      destination[i] = deepMerge(target[i], e, options);
    } else if (target.indexOf(e) === -1) {
      destination.push(e);
    }
  });
  return destination;
}

export default class EditorArrayComponent extends EditorComponent {
  static defaultProps = {
    itemProps: {},
    sliceStartIndex: 0,
    sliceEndIndex: Infinity
  };

  static insertItem(items, itemIndex, itemData) {
    const itemDataStripped = stripSystemKeys(itemData);
    const itemDataWithIds = setIds(itemDataStripped);
    const updatedValue = insert(items, itemIndex, itemDataWithIds);

    return updatedValue;
  }

  static insertItemsBatch(items, itemIndex, itemsData) {
    const updatedValue = itemsData.reduce((acc, itemData, index) => {
      const itemDataStripped = stripSystemKeys(itemData);
      const itemDataWithIds = setIds(itemDataStripped);

      return insert(acc, itemIndex + index, itemDataWithIds);
    }, items);

    return updatedValue;
  }

  static cloneItem(items, itemIndex, toIndex = itemIndex + 1) {
    if (!items[itemIndex]) {
      throw new Error(`Can't clone invalid item at index ${itemIndex}`);
    }

    return EditorArrayComponent.insertItem(items, toIndex, items[itemIndex]);
  }

  insertItem(itemIndex, itemData) {
    const itemDataStripped = stripSystemKeys(itemData);
    const itemDataWithIds = setIds(itemDataStripped);
    const dbValue = this.getDBValue() || [];
    const updatedValue = insert(dbValue, itemIndex, itemDataWithIds);

    this.handleValueChange(updatedValue, { arrayOperation: "insert" });
  }

  insertItemsBatch(itemIndex, itemsData) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = itemsData.reduce((acc, itemData, index) => {
      const itemDataStripped = stripSystemKeys(itemData);
      const itemDataWithIds = setIds(itemDataStripped);

      return insert(acc, itemIndex + index, itemDataWithIds);
    }, dbValue);

    this.handleValueChange(updatedValue, { arrayOperation: "insert_bulk" });
  }

  updateItem(itemIndex, itemValue, updateMeta = {}) {
    const dbValue = this.getDBValue();
    const updatedValue = setIn(dbValue, [itemIndex, "value"], itemValue);

    this.handleValueChange(
      updatedValue,
      Object.assign(updateMeta, { arrayOperation: "itemChange" })
    );
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.handleValueChange(updatedValue, { arrayOperation: "remove" });
  }

  replaceItem(itemIndex, itemData, meta) {
    const itemDataStripped = stripSystemKeys(itemData, { exclude: ["_id"] });
    const itemDataWithIds = setIds(itemDataStripped, meta.idOptions);
    const dbValue = this.getDBValue() || [];
    const updatedValue = replaceAt(dbValue, itemIndex, itemDataWithIds);

    this.handleValueChange(updatedValue, {
      arrayOperation: "replace",
      itemIndex,
      oldValue: dbValue
    });
  }

  cloneItem(itemIndex, toIndex = itemIndex + 1) {
    const dbValue = this.getDBValue() || [];

    if (!dbValue[itemIndex]) {
      throw new Error(`Can't clone invalid item at index ${itemIndex}`);
    }

    this.insertItem(toIndex, dbValue[itemIndex]); // the object will be cloned there
  }

  handleKeyDown = (e, { keyName, id }) => {
    e.preventDefault();
    const v = this.getValue();
    const itemIndex = v.findIndex(({ value: { _id } }) => _id === id);

    switch (keyName) {
      case "alt+N":
      case "ctrl+N":
      case "cmd+N":
      case "right_cmd+N":
        this.addColumn(itemIndex + 1);
        return;
      case "alt+D":
      case "ctrl+D":
      case "cmd+D":
      case "right_cmd+D":
        this.cloneItem(itemIndex);
        return;
      case "alt+C":
      case "ctrl+C":
      case "cmd+C":
      case "right_cmd+C":
        this.copy(itemIndex);
        return;
      case "alt+V":
      case "ctrl+V":
      case "cmd+V":
      case "right_cmd+V":
        this.paste(itemIndex);
        return;
      case "alt+shift+V":
      case "ctrl+shift+V":
      case "cmd+shift+V":
      case "right_cmd+shift+V":
      case "shift+alt+V":
      case "shift+ctrl+V":
      case "shift+cmd+V":
      case "shift+right_cmd+V":
        this.pasteStyles(itemIndex);
        return;
      case "ctrl+right":
      case "cmd+right":
      case "right_cmd+right":
        this.changeHorizontalAlign(itemIndex, "increase");
        return;
      case "ctrl+left":
      case "cmd+left":
      case "right_cmd+left":
        this.changeHorizontalAlign(itemIndex, "decrease");
        return;
      case "ctrl+up":
      case "cmd+up":
      case "right_cmd+up":
      case "alt+up":
        this.changeVerticalAlign(itemIndex, "decrease");
        return;
      case "ctrl+down":
      case "cmd+down":
      case "right_cmd+down":
      case "alt+down":
        this.changeVerticalAlign(itemIndex, "increase");
        return;
      case "alt+del":
      case "del":
      case "cmd+backspace":
      case "cmd+del":
      case "right_cmd+backspace":
      case "right_cmd+del":
        this.removeItem(itemIndex);
        return;
    }
  };

  getDefaultValue() {
    return this.props.defaultValue || [];
  }

  getValue() {
    return this.getDBValue() || this.getDefaultValue();
  }

  getValue2() {
    const defaultValue = this.getDefaultValue();
    const dbValue = this.getDBValue();

    return {
      v: dbValue || defaultValue
    };
  }

  validateValue() {
    // always valid
  }

  getItemProps(itemData, itemIndex, items) {
    const { itemProps: defaultItemProps } = EditorArrayComponent.defaultProps;
    const { itemProps = defaultItemProps } = this.props;

    return typeof itemProps === "function"
      ? itemProps(itemData, itemIndex, items)
      : itemProps;
  }

  renderItemData(itemData, itemKey, itemIndex, items) {
    const { type, value } = itemData;
    const ItemComponent = Editor.getComponent(type);

    const defaultValue = this.getDefaultValue();

    const itemProps = this.getItemProps(itemData, itemIndex, items);
    const itemPath = [...this.getPath(), itemIndex, "value"];
    const itemDefaultValue =
      defaultValue[itemIndex] && defaultValue[itemIndex].value;
    const itemDBValue = value;
    const itemOnChange = (itemValue, meta = {}) => {
      const { intent } = meta;

      if (intent === "replace_all") {
        this.replaceItem(itemIndex, itemValue, meta);
      } else {
        if (itemValue === null) {
          this.removeItem(itemIndex, meta);
        } else {
          this.updateItem(itemIndex, itemValue, meta);
        }
      }
    };

    if (ItemComponent) {
      return (
        <ItemComponent
          {...itemProps}
          key={itemKey}
          path={itemPath}
          defaultValue={itemDefaultValue}
          dbValue={itemDBValue}
          reduxState={this.getReduxState()}
          reduxDispatch={this.getReduxDispatch()}
          onChange={itemOnChange}
        />
      );
    } else {
      const NotFoundComponent = Editor.getNotFoundComponent();

      return (
        <NotFoundComponent
          {...itemProps}
          key={itemKey}
          path={itemPath}
          defaultValue={itemDefaultValue}
          dbValue={itemDBValue}
          reduxState={this.getReduxState()}
          reduxDispatch={this.getReduxDispatch()}
          onChange={itemOnChange}
          componentId={type}
        />
      );
    }
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData, items) {
    return item;
  }

  renderItem = (itemData, itemIndex, items) => {
    const {
      sliceStartIndex: defaultSliceStartIndex,
      sliceEndIndex: defaultSliceEndIndex
    } = EditorArrayComponent.defaultProps;
    const {
      sliceStartIndex = defaultSliceStartIndex,
      sliceEndIndex = defaultSliceEndIndex
    } = this.props;

    // allows rendering of a slice of the items
    if (itemIndex >= sliceStartIndex && itemIndex < sliceEndIndex) {
      const itemKey = itemData.value._id;
      const item = this.renderItemData(itemData, itemKey, itemIndex, items);

      return this.renderItemWrapper(item, itemKey, itemIndex, itemData, items);
    } else {
      return null;
    }
  };

  renderItemsContainer(items) {
    return items;
  }

  renderForEdit(v) {
    const items = v.map(this.renderItem);

    return this.renderItemsContainer(items, v);
  }

  getCurrentCopiedElement = () => {
    const { path, value } = copiedElementNoRefsSelector(getStore().getState());

    if (value) {
      return getIn(value, path);
    }

    return null;
  };

  changeVerticalAlign(index, alignDirection) {
    const v = this.getValue();
    const data = pageDataNoRefsSelector(getStore().getState());
    const activeElementPath = global.Brizy.activeEditorComponent.getPath();

    const {
      path,
      value: { type, value }
    } = getParentWhichContainsStyleProperty(
      activeElementPath,
      data,
      "verticalAlign"
    );

    if (value) {
      const alignList = ["top", "center", "bottom"];
      const {
        defaultValue: {
          style: { verticalAlign }
        }
      } = Editor.getComponent(type);
      const currentAlign = value.verticalAlign || verticalAlign || "top";
      const nextAlign = getElementOfArrayLoop(
        alignList,
        currentAlign,
        alignDirection
      );

      const currentPath = this.getPath();
      const newPath = path.reduce((acc, item, index) => {
        if (currentPath[index] === undefined) {
          acc.push(path[index]);
        }

        return acc;
      }, []);

      const newValue = setIn(v, [...newPath, "value"], {
        ...value,
        verticalAlign: nextAlign
      });

      this.updateItem(index, newValue[index].value);
    }
  }

  changeHorizontalAlign(index, alignDirection) {
    const v = this.getValue();
    const activeElementPath = global.Brizy.activeEditorComponent.getPath();
    const state = getStore().getState();
    const data = pageDataNoRefsSelector(state);
    const { deviceMode } = state.ui;
    const alignName =
      deviceMode === "desktop"
        ? "horizontalAlign"
        : `${deviceMode}HorizontalAlign`;

    const {
      path,
      value: { type, value }
    } = getParentWhichContainsStyleProperty(activeElementPath, data, alignName);

    if (value) {
      const alignList = ["left", "center", "right"];
      const {
        defaultValue: { style }
      } = Editor.getComponent(type);
      const currentAlign = value[alignName] || style[alignName] || "left";
      const nextAlign = getElementOfArrayLoop(
        alignList,
        currentAlign,
        alignDirection
      );

      const currentPath = this.getPath();
      const newPath = path.reduce((acc, item, index) => {
        if (currentPath[index] === undefined) {
          acc.push(path[index]);
        }

        return acc;
      }, []);

      const newValue = setIn(v, [...newPath, "value"], {
        ...value,
        [alignName]: nextAlign
      });

      this.updateItem(index, newValue[index].value);
    }
  }

  copy(index) {
    const dispatch = this.getReduxDispatch();
    const shortcodePath = [...this.getPath(), index];
    const pageData = this.getReduxState().page.data;

    dispatch(updateCopiedElement({ value: pageData, path: shortcodePath }));
  }

  paste(index) {
    const v = this.getValue()[index];
    const { path, value: copiedValue } = copiedElementNoRefsSelector(
      getStore().getState()
    );
    if (!copiedValue) {
      return;
    }

    const { value } = getClosestParent(
      path,
      copiedValue,
      v.type === "Cloneable" || v.type === "Wrapper"
        ? ({ type }) => type === "Cloneable" || type === "Wrapper"
        : ({ type }) => type === v.type
    );
    if (value) {
      this.insertItem(index + 1, value);
    }
  }

  pasteStyles(index) {
    const { path, value: copiedValue } = copiedElementNoRefsSelector(
      getStore().getState()
    );
    if (!copiedValue) {
      return;
    }

    const v = this.getValue()[index];
    const copiedElement = this.getCurrentCopiedElement();
    let depth = 0;
    if (copiedElement) {
      if (copiedElement.type === "Wrapper" && v.type === "Wrapper") {
        if (copiedElement.value.items[0].type !== v.value.items[0].type) return;

        depth = 1;
        if (
          copiedElement.value.items[0].type === "Form" ||
          copiedElement.value.items[0].type === "IconText"
        ) {
          depth = 3;
        } else if (copiedElement.value.items[0].type === "ImageGallery") {
          depth = 2;
        }
      }
    }

    const { value } = getClosestParent(
      path,
      copiedValue,
      ({ type }) => type === v.type
    );

    if (value) {
      const newValue = setStyles(value, depth);

      const mergedValue = deepMerge(v, newValue, {
        arrayMerge: combineMerge
      });

      this.updateItem(index, mergedValue.value);
    }
  }
}
