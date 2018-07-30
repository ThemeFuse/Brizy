import React from "react";
import deepExtend from "deep-extend";
import { insert, removeAt, replaceAt, setIn } from "timm";
import Editor from "visual/global/Editor";
import EditorComponent from "./EditorComponent";
import { setIds } from "visual/utils/models";

export function insertItem(value, itemIndex, itemData) {
  const itemDataWithIds = setIds(itemData);
  const updatedValue = insert(value, itemIndex, itemDataWithIds);

  return updatedValue;
}

export function cloneItem(value, itemIndex, toIndex = itemIndex + 1) {
  if (!value[itemIndex]) {
    throw new Error(`Can't clone invalid item at index ${itemIndex}`);
  }

  return insertItem(value, toIndex, value[itemIndex]); // the object will be cloned there
}

export default class EditorArrayComponent extends EditorComponent {
  static defaultProps = {
    itemProps: {},
    sliceStartIndex: 0,
    sliceEndIndex: Infinity
  };

  insertItem(itemIndex, itemData) {
    const itemDataWithIds = setIds(itemData);

    const dbValue = this.getDBValue() || [];
    const updatedValue = insert(dbValue, itemIndex, itemDataWithIds);

    this.handleValueChange(updatedValue, { arrayOperation: "insert" });
  }

  updateItem(itemIndex, itemValue) {
    const dbValue = this.getDBValue();
    const updatedValue = setIn(dbValue, [itemIndex, "value"], itemValue);

    this.handleValueChange(updatedValue, {
      arrayOperation: "itemChange"
    });
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.handleValueChange(updatedValue, { arrayOperation: "remove" });
  }

  replaceItem(itemIndex, itemData, meta) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = replaceAt(
      dbValue,
      itemIndex,
      setIds(itemData, meta.idOptions)
    );

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

  getDefaultValue() {
    return this.props.defaultValue || [];
  }

  getValue() {
    return this.getDBValue() || this.getDefaultValue();
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
          this.removeItem(itemIndex);
        } else {
          this.updateItem(itemIndex, itemValue);
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

    return this.renderItemsContainer(items);
  }
}
