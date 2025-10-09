import deepMerge from "deepmerge";
import { produce } from "immer";
import React from "react";
import { getIn, insert, removeAt, replaceAt, setIn } from "timm";
import ErrorBoundary from "visual/component/ErrorBoundary";
import {
  flattenDefaultValue,
  makeToolbarPropsFromConfigDefaults
} from "visual/editorComponents/EditorComponent/utils";
import { symbolsToItems } from "visual/editorComponents/Menu/utils";
import Editor from "visual/global/Editor";
import { updateCopiedElement, updateUI } from "visual/redux/actions2";
import {
  copiedElementNoRefsSelector,
  pageDataNoRefsSelector,
  rulesSelector,
  uiSelector
} from "visual/redux/selectors";
import { move } from "visual/utils/array";
import { applyFilter } from "visual/utils/filters";
import {
  createFullModelPath,
  getClosestParent,
  getElementOfArrayLoop,
  getParentWhichContainsStyleProperty,
  mapModels,
  setIds,
  setOffsetsToElementFromWrapper,
  setStyles,
  stripSystemKeys
} from "visual/utils/models";
import { mergeOptions } from "visual/utils/options/utils";
import { read as readNumber } from "visual/utils/reader/number";
import * as State from "visual/utils/stateMode";
import { getComponentDefaultValue } from "visual/utils/traverse/common";
import EditorComponent from "./EditorComponent";

const emptyTarget = (value) => (Array.isArray(value) ? [] : {});
const clone = (value, options) => deepMerge(emptyTarget(value), value, options);

function combineMerge(target, source, options) {
  const destination = target.slice();

  // remove additional items which shouldn't be in destination
  if (destination?.length > 0 && source?.length > 0) {
    source.splice(target.length);
  }

  source.forEach(function (e, i) {
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

    this.revalidateItemValueProcessedCache(itemIndex);
    this.handleValueChange(updatedValue, {
      arrayOperation: "insert"
    });
  }

  insertItemsBatch(itemIndex, itemsData) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = itemsData.reduce((acc, itemData, index) => {
      const itemDataStripped = stripSystemKeys(itemData);
      const itemDataWithIds = setIds(itemDataStripped);
      const to = itemIndex + index;

      this.revalidateItemValueProcessedCache(to);
      return insert(acc, to, itemDataWithIds);
    }, dbValue);

    this.handleValueChange(updatedValue, {
      arrayOperation: "insert_bulk"
    });
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

    this.revalidateItemValueProcessedCache(itemIndex);
    this.handleValueChange(updatedValue, { arrayOperation: "remove" });
  }

  replaceItem(itemIndex, itemData, meta) {
    const itemDataStripped = stripSystemKeys(itemData, {
      exclude: ["_id"]
    });
    const itemDataWithIds = setIds(itemDataStripped, meta.idOptions);
    const dbValue = this.getDBValue() || [];
    const updatedValue = replaceAt(dbValue, itemIndex, itemDataWithIds);

    this.revalidateItemValueProcessedCache(itemIndex);
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

    this.revalidateItemValueProcessedCache(toIndex);
    this.insertItem(toIndex, dbValue[itemIndex]); // the object will be cloned there
  }

  reorderItem(from, to) {
    const dbValue = this.getDBValue() || [];

    this.revalidateItemValueProcessedCache(from);
    this.revalidateItemValueProcessedCache(to);
    this.handleValueChange(move(from, to, dbValue), {
      arrayOperation: "moveItem"
    });
  }

  handleOpenRightSidebar(tab) {
    const state = this.getReduxState();
    const dispatch = this.getReduxDispatch();

    const { rightSidebar, activeTab } = uiSelector(state);

    if (!rightSidebar.isOpen || activeTab !== tab) {
      this.setState({ isSidebarOpen: true }, () => {
        dispatch(
          updateUI("rightSidebar", {
            ...rightSidebar,
            isOpen: true,
            activeTab: tab
          })
        );
      });
    }
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
      case "ctrl+M":
      case "cmd+M":
      case "right_cmd+M":
        this.handleOpenRightSidebar("styles");
        return;
      case "ctrl+K":
      case "cmd+K":
      case "right_cmd+K":
        this.handleOpenRightSidebar("effects");
        return;
      case "alt+D":
      case "ctrl+D":
      case "cmd+D":
      case "right_cmd+D":
        if (v[itemIndex].type === "StoryWrapper") {
          const rules = rulesSelector(this.getReduxStore().getState());
          this.insertItem(
            itemIndex + 1,
            setOffsetsToElementFromWrapper(v[itemIndex], rules)
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
          this.paste(itemIndex, (sourceV) => {
            const { offsetX = 0, offsetY = 0 } =
              v[itemIndex].value.items[0].value;
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
            const rules = rulesSelector(this.getReduxStore().getState());
            return setOffsetsToElementFromWrapper(newV, rules);
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
      case "ctrl+del":
      case "cmd+del":
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

  revalidateItemValueProcessedCache(itemIndex) {
    if (!this._itemDefaultValueProcessedCache?.[itemIndex]) {
      return;
    }

    delete this._itemDefaultValueProcessedCache[itemIndex];
  }

  getItemDefaultValue(itemIndex) {
    if (this._itemDefaultValueProcessedCache?.[itemIndex]) {
      return this._itemDefaultValueProcessedCache[itemIndex];
    }

    const v = this.getValue()[itemIndex];

    const defaultValue = getComponentDefaultValue(v.type) || {};
    const defaultValueFlat = flattenDefaultValue(defaultValue);

    this._itemDefaultValueProcessedCache =
      this._itemDefaultValueProcessedCache || {};
    this._itemDefaultValueProcessedCache[itemIndex] = defaultValueFlat;

    return defaultValueFlat;
  }

  getItemStylesValue(itemIndex) {
    const dbValue = this.getDBValue()[itemIndex].value;
    const currentStyleRules = rulesSelector(this.getReduxState());

    if ("_styles" in dbValue && dbValue._styles && currentStyleRules) {
      return dbValue._styles.reduce((acc, style) => {
        const ruleStyle = currentStyleRules[style];

        return ruleStyle ? Object.assign(acc, ruleStyle) : acc;
      }, {});
    }

    return null;
  }

  getItemValue(itemIndex) {
    const defaultValue = this.getItemDefaultValue(itemIndex);
    const stylesValue = this.getItemStylesValue(itemIndex);
    const dbValue = this.getDBValue()[itemIndex].value;

    return { ...defaultValue, ...stylesValue, ...dbValue };
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

  makeItemsToolbarPropsFromConfig2(config, sidebarConfig, options = {}) {
    const { onToolbarOpen, onToolbarClose, onToolbarEnter, onToolbarLeave } =
      this.props;

    const {
      itemIndex,
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

    if (readNumber(itemIndex) === undefined) {
      throw new Error("Missing itemIndex in options");
    }

    const getItems = (deviceMode = this.getDeviceMode()) => {
      if (process.env.NODE_ENV === "development") {
        if (!config.getItems) {
          // eslint-disable-next-line no-console
          console.warn(
            `${this.getComponentId()}. getItems not found in toolbarConfig`
          );
        }
      }
      const v = this.getItemValue(itemIndex);
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
          context: this.context
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
              state: stateMode,
              context: this.context
            })
          );

          items = mergeOptions(items, thirdPartyItems);
        }
      }

      return items;
    };

    const getSidebarItems = (deviceMode = this.getDeviceMode()) => {
      const v = this.getItemValue(itemIndex);
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
          context: this.context
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
              state: stateMode,
              context: this.context
            })
          );

          items = mergeOptions(items, thirdPartyItems);
        }
      }

      return items;
    };

    const getSidebarTitle = () => {
      let title = sidebarConfig?.title;

      if (typeof title === "function") {
        const v = this.getItemValue(itemIndex);
        title = title({ v });
      }

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
      onBeforeOpen: () => {
        global.Brizy.activeEditorComponent = this;
      },
      onBeforeClose: () => {
        global.Brizy.activeEditorComponent = null;
      },
      onOpen: onToolbarOpen,
      onClose: onToolbarClose,
      onMouseEnter: onToolbarEnter,
      onMouseLeave: onToolbarLeave
    };
  }

  renderItemData(itemData, itemKey, itemIndex, items) {
    const { renderContext, editorMode, getGlobalConfig } = this.props;
    const config = this.getGlobalConfig();

    const { type, value } = itemData;
    const ItemComponent = Editor.getComponent(type);

    const defaultValue = this.getDefaultValue();

    const itemProps = this.getItemProps(itemData, itemIndex, items);
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
          config={config}
          onRemove={() => this.removeItem(itemIndex)}
          renderContext={this.props.renderContext}
        >
          <ItemComponent
            {...itemProps}
            defaultValue={itemDefaultValue}
            dbValue={itemDBValue}
            reduxState={this.getReduxState()}
            reduxStore={this.getReduxStore()}
            reduxDispatch={this.getReduxDispatch()}
            onChange={itemOnChange}
            renderContext={renderContext}
            editorMode={editorMode}
            getGlobalConfig={getGlobalConfig}
          />
        </ErrorBoundary>
      );
    } else {
      const NotFoundComponent = Editor.getNotFoundComponent();

      return (
        <NotFoundComponent
          {...itemProps}
          key={itemKey}
          defaultValue={itemDefaultValue}
          dbValue={itemDBValue}
          reduxState={this.getReduxState()}
          reduxStore={this.getReduxStore()}
          reduxDispatch={this.getReduxDispatch()}
          onChange={itemOnChange}
          componentId={type}
          renderContext={this.props.renderContext}
          editorMode={this.props.editorMode}
          getGlobalConfig={getGlobalConfig}
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

  getAlignments() {
    return ["top", "center", "bottom"];
  }

  renderItemsContainer(items) {
    return items;
  }

  renderForEdit(v) {
    const items = v.map(this.renderItem);

    return this.renderItemsContainer(items, v);
  }

  getIdBindKey() {
    const id = this.getId();
    const [uid, bindWithKey] = id.split("-");

    return {
      id: uid,
      bindKey: bindWithKey
    };
  }

  getCurrentCopiedElement = () => {
    const { path, value } = copiedElementNoRefsSelector(
      this.getReduxStore().getState()
    );

    if (value && path.length > 0) {
      return getIn(attachMenu(value, this.getGlobalConfig().menuData), path);
    }

    return null;
  };

  changeVerticalAlign(index, alignDirection) {
    const v = this.getValue();
    const data = pageDataNoRefsSelector(this.getReduxStore().getState());
    const activeElementId = global.Brizy.activeEditorComponent.getId();
    const activeElementPath = createFullModelPath(data, [activeElementId]);

    const { path, value: parentValue } = getParentWhichContainsStyleProperty(
      activeElementPath,
      data,
      "verticalAlign"
    );

    if (parentValue && path) {
      const { type, value } = parentValue;
      const alignList = this.getAlignments();
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

      const { id, bindKey } = this.getIdBindKey();
      const pathUid = bindKey ? [id, bindKey, `${index}`] : [id, `${index}`];
      const currentPath = createFullModelPath(data, pathUid);
      const newPath = path.reduce((acc, item, index) => {
        if (currentPath[index] === undefined) {
          acc.push(path[index]);
        }

        return acc;
      }, []);

      if (newPath.length === 0) {
        const newValue = setIn(v, [index, "value"], {
          ...value,
          verticalAlign: nextAlign
        });

        this.updateItem(index, newValue[index].value);
      } else {
        const newValue = setIn(v, [...newPath, "value"], {
          ...value,
          verticalAlign: nextAlign
        });

        this.updateItem(index, newValue[index].value);
      }
    }
  }

  changeHorizontalAlign(index, alignDirection) {
    const v = this.getValue();
    const activeElementId = global.Brizy.activeEditorComponent.getId();
    const state = this.getReduxStore().getState();
    const data = pageDataNoRefsSelector(state);
    const activeElementPath = createFullModelPath(data, [activeElementId]);

    const { deviceMode } = state.ui;
    const alignName =
      deviceMode === "desktop"
        ? "horizontalAlign"
        : `${deviceMode}HorizontalAlign`;

    const { path, value: parentValue } = getParentWhichContainsStyleProperty(
      activeElementPath,
      data,
      alignName
    );

    if (parentValue && path) {
      const { type, value } = parentValue;
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

      const { id, bindKey } = this.getIdBindKey();
      const pathUid = bindKey ? [id, bindKey, `${index}`] : [id, `${index}`];
      const currentPath = createFullModelPath(data, pathUid);
      const newPath = path.reduce((acc, item, index) => {
        if (currentPath[index] === undefined) {
          acc.push(path[index]);
        }

        return acc;
      }, []);

      if (newPath.length === 0) {
        const newValue = setIn(v, [index, "value"], {
          ...value,
          [alignName]: nextAlign
        });

        this.updateItem(index, newValue[index].value);
      } else {
        const newValue = setIn(v, [...newPath, "value"], {
          ...value,
          [alignName]: nextAlign
        });

        this.updateItem(index, newValue[index].value);
      }
    }
  }

  copy(index) {
    const dispatch = this.getReduxDispatch();
    const data = pageDataNoRefsSelector(this.getReduxState());
    const { id, bindKey } = this.getIdBindKey();
    const pathUid = bindKey ? [id, bindKey, `${index}`] : [id, `${index}`];
    const shortcodePath = createFullModelPath(data, pathUid);
    const pageData = attachMenu(data, this.getGlobalConfig().menuData);

    dispatch(
      updateCopiedElement({
        value: pageData,
        path: shortcodePath
      })
    );
  }

  // cb = v => v -> it's needed for cases when we want to change somehow final value
  paste(index, cb = (v) => v) {
    const v = this.getValue()[index];
    const { path, value: copiedValue } = copiedElementNoRefsSelector(
      this.getReduxStore().getState()
    );
    if (!copiedValue) {
      return;
    }

    const { value } = getClosestParent(
      path,
      attachMenu(copiedValue, this.getGlobalConfig().menuData),
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
      this.getReduxStore().getState()
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
          copiedElement.value.items[0].type === "IconText" ||
          copiedElement.value.items[0].type === "Form2"
        ) {
          depth = 3;
        } else if (copiedElement.value.items[0].type === "ImageGallery") {
          depth = 2;
        }
      }
    }

    const { value } = getClosestParent(
      path,
      attachMenu(copiedValue, this.getGlobalConfig().menuData),
      ({ type }) => type === v.type
    );

    const rules = rulesSelector(this.getReduxStore().getState());

    if (value) {
      const newValue = setStyles({
        depth,
        componentValue: value,
        deviceMode: this.getDeviceMode(),
        rules
      });

      const mergedValue = deepMerge(v, newValue, {
        arrayMerge: combineMerge
      });

      this.updateItem(index, mergedValue.value);
    }
  }
}

function attachMenu(value, menusConfig) {
  return mapModels((block) => {
    const { type, value } = block;

    if (type === "Menu") {
      const { menuSelected: dbMenuSelected, symbols = {} } = value;
      const menuSelected = dbMenuSelected || menusConfig[0]?.id;

      if (menuSelected) {
        const menuConfig =
          menusConfig.find((menu) => menu.id === menuSelected) || {};

        return produce(block, (draft) => {
          draft.value.items = symbolsToItems(menuConfig.items || [], symbols);
        });
      }
    }

    return block;
  }, value);
}
