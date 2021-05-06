import React from "react";
import deepMerge from "deepmerge";
import { insert, removeAt, replaceAt, setIn, getIn } from "timm";
import { produce } from "immer";
import Editor from "visual/global/Editor";
import Config from "visual/global/Config";
import { getStore } from "visual/redux/store";
import {
  pageDataDraftBlocksSelector,
  pageDataNoRefsSelector,
  copiedElementNoRefsSelector
} from "visual/redux/selectors";
import { setOffsetsToElementFromWrapper } from "visual/utils/models";
import { updateCopiedElement } from "visual/redux/actions";
import EditorComponent from "./EditorComponent";
import ErrorBoundary from "visual/component/ErrorBoundary";
import {
  stripSystemKeys,
  setIds,
  setStyles,
  getElementOfArrayLoop,
  getClosestParent,
  getParentWhichContainsStyleProperty,
  mapModels
} from "visual/utils/models";
import { symbolsToItems } from "visual/editorComponents/Menu";
import { move } from "visual/utils/array";
const menusConfig = Config.get("menuData");

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

  reorderItem(from, to) {
    const dbValue = this.getDBValue() || [];

    this.handleValueChange(move(from, to, dbValue), {
      arrayOperation: "moveItem"
    });
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
        if (v[itemIndex].type === "StoryWrapper") {
          this.insertItem(
            itemIndex + 1,
            setOffsetsToElementFromWrapper(v[itemIndex])
          );
        } else {
          this.cloneItem(itemIndex);
        }
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
        if (v[itemIndex].type === "StoryWrapper") {
          this.paste(itemIndex, sourceV => {
            const { offsetX = 0, offsetY = 0 } = v[
              itemIndex
            ].value.items[0].value;
            let newV = setIn(
              sourceV,
              ["value", "items", 0, "value", "offsetX"],
              offsetX
            );
            newV = setIn(
              newV,
              ["value", "items", 0, "value", "offsetY"],
              offsetY
            );
            return setOffsetsToElementFromWrapper(newV);
          });
        } else {
          this.paste(itemIndex);
        }
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

      switch (intent) {
        case "replace_all": {
          this.replaceItem(itemIndex, itemValue, meta);
          break;
        }
        case "remove_all": {
          this.removeItem(itemIndex, meta);
          break;
        }
        default: {
          this.updateItem(itemIndex, itemValue, meta);
        }
      }
    };

    if (ItemComponent) {
      return (
        <ErrorBoundary
          key={itemKey}
          onRemove={() => this.removeItem(itemIndex)}
        >
          <ItemComponent
            {...itemProps}
            path={itemPath}
            defaultValue={itemDefaultValue}
            dbValue={itemDBValue}
            reduxState={this.getReduxState()}
            reduxDispatch={this.getReduxDispatch()}
            onChange={itemOnChange}
          />
        </ErrorBoundary>
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

  /* eslint-disable no-unused-vars */
  renderItemWrapper(item, itemKey, itemIndex, itemData, items) {
    return item;
  }
  /* eslint-enabled no-unused-vars */

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
      return getIn(attachMenu(value), path);
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
    const pageData = attachMenu(
      pageDataDraftBlocksSelector(this.getReduxState())
    );

    dispatch(updateCopiedElement({ value: pageData, path: shortcodePath }));
  }

  // cb = v => v -> it's needed for cases when we want to change somehow final value
  paste(index, cb = v => v) {
    const v = this.getValue()[index];
    const { path, value: copiedValue } = copiedElementNoRefsSelector(
      getStore().getState()
    );
    if (!copiedValue) {
      return;
    }

    const { value } = getClosestParent(
      path,
      attachMenu(copiedValue),
      v.type === "Cloneable" || v.type === "Wrapper"
        ? ({ type }) => type === "Cloneable" || type === "Wrapper"
        : ({ type }) => type === v.type
    );
    if (value) {
      this.insertItem(index + 1, cb(value));
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
      if (
        (copiedElement.type === "Wrapper" && v.type === "Wrapper") ||
        (copiedElement.type === "StoryWrapper" && v.type === "StoryWrapper")
      ) {
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
      attachMenu(copiedValue),
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

function attachMenu(value) {
  return mapModels(block => {
    const { type, value } = block;

    if (type === "Menu") {
      const { menuSelected: dbMenuSelected, symbols = {} } = value;
      const menuSelected = dbMenuSelected || menusConfig[0].id;
      const menuConfig =
        menusConfig.find(menu => menu.id === menuSelected) || {};

      return produce(block, draft => {
        draft.value.items = symbolsToItems(menuConfig.items || [], symbols);
      });
    }

    return block;
  }, value);
}
