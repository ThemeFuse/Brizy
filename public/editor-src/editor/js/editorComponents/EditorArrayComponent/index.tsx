import deepMerge from "deepmerge";
import { produce } from "immer";
import React, { Profiler, type ReactElement, type ReactNode } from "react";
import { getIn, insert, removeAt, replaceAt, setIn } from "timm";
import type {
  ElementDefaultValue,
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import ErrorBoundary from "visual/component/ErrorBoundary";
import type {
  Model,
  NewToolbarConfig,
  SidebarConfig,
  ToolbarExtend
} from "visual/editorComponents/EditorComponent/types";
import {
  flattenDefaultValue,
  makeToolbarPropsFromConfigDefaults
} from "visual/editorComponents/EditorComponent/utils";
import { symbolsToItems } from "visual/editorComponents/Menu/utils";
import type { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import Editor from "visual/global/Editor";
import { updateCopiedElement, updateUI } from "visual/redux/actions2";
import {
  copiedElementNoRefsSelector,
  menuDataSelector,
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
  isModel,
  mapModels,
  setIds,
  setOffsetsToElementFromWrapper,
  setStyles,
  stripSystemKeys
} from "visual/utils/models";
import { mergeOptions } from "visual/utils/options/utils";
import { createProfilerMeasure } from "visual/utils/profilerMeasure";
import { read as readNumber } from "visual/utils/reader/number";
import type * as Responsive from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { getComponentDefaultValue } from "visual/utils/traverse/common";
import { throwOnNullish } from "visual/utils/value";
import EditorComponent, { type Props } from "../EditorComponent";
import type {
  AlignDirection,
  ArrayItem,
  ArrayMeta,
  ArrayProps,
  ItemProps,
  ItemsToolbarOptions,
  KeyDownMeta
} from "./types";

type MenuData = ReturnType<typeof menuDataSelector>;
type DefaultStyle = NonNullable<ElementDefaultValue["style"]>;
type MergeOptions = deepMerge.Options &
  Required<Pick<deepMerge.Options, "isMergeableObject">>;

const onRenderArray = createProfilerMeasure();

const emptyTarget = (value: unknown) => (Array.isArray(value) ? [] : {});
const clone = (value: Record<string, unknown>, options: MergeOptions) =>
  deepMerge<Record<string, unknown>>(emptyTarget(value), value, options);

function combineMerge(
  target: Record<string, unknown>[],
  source: Record<string, unknown>[],
  options: MergeOptions
) {
  const destination = target.slice();

  // remove additional items which shouldn't be in destination
  if (destination?.length > 0 && source?.length > 0) {
    source.splice(target.length);
  }

  source.forEach((e, i) => {
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

export default class EditorArrayComponent<
  M extends ElementModel = ElementModel,
  // biome-ignore lint/suspicious/noExplicitAny: same constraint as EditorComponent
  P extends Record<string, any> = Record<string, unknown>,
  // biome-ignore lint/suspicious/noExplicitAny: same constraint as EditorComponent
  S extends Record<string, any> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> extends EditorComponent<M, ArrayProps<M> & P, S, C> {
  static defaultProps = {
    itemProps: {},
    sliceStartIndex: 0,
    sliceEndIndex: Infinity
  };

  declare _itemDefaultValueProcessedCache: Record<number, M> | undefined;

  insertItem(itemIndex: number, itemData: ArrayItem<M>): void {
    const itemDataStripped = stripSystemKeys(itemData);
    const itemDataWithIds = setIds(itemDataStripped);
    const dbValue: ArrayItem<M>[] = this.getDBValue() || [];
    const updatedValue = insert(dbValue, itemIndex, itemDataWithIds);

    this.revalidateItemValueProcessedCache(itemIndex);
    // @ts-expect-error the stored value of an array component is a list
    this.handleValueChange(updatedValue, {
      arrayOperation: "insert"
    });
  }

  insertItemsBatch(itemIndex: number, itemsData: ArrayItem<M>[]): void {
    const dbValue: ArrayItem<M>[] = this.getDBValue() || [];
    const updatedValue = itemsData.reduce((acc, itemData, index) => {
      const itemDataStripped = stripSystemKeys(itemData);
      const itemDataWithIds = setIds(itemDataStripped);
      const to = itemIndex + index;

      this.revalidateItemValueProcessedCache(to);
      return insert(acc, to, itemDataWithIds);
    }, dbValue);

    // @ts-expect-error the stored value of an array component is a list
    this.handleValueChange(updatedValue, {
      arrayOperation: "insert_bulk"
    });
  }

  updateItem(
    itemIndex: number,
    itemValue: M | null,
    updateMeta: ArrayMeta<M> = {}
  ): void {
    const dbValue = this.getDBValue();
    const updatedValue = setIn(dbValue, [itemIndex, "value"], itemValue);

    this.handleValueChange(
      // @ts-expect-error timm's setIn returns unknown
      updatedValue,
      Object.assign(updateMeta, { arrayOperation: "itemChange" })
    );
  }

  removeItem(itemIndex: number): void {
    const dbValue: ArrayItem<M>[] = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.revalidateItemValueProcessedCache(itemIndex);
    // @ts-expect-error the stored value of an array component is a list
    this.handleValueChange(updatedValue, { arrayOperation: "remove" });
  }

  replaceItem(
    itemIndex: number,
    itemData: ArrayItem<M>,
    meta: ArrayMeta<M>
  ): void {
    const itemDataStripped = stripSystemKeys(itemData, {
      // @ts-expect-error stripSystemKeys is still JS and infers an empty list
      exclude: ["_id"]
    });
    const itemDataWithIds = setIds(itemDataStripped, meta.idOptions);
    const dbValue: ArrayItem<M>[] = this.getDBValue() || [];
    const updatedValue = replaceAt(dbValue, itemIndex, itemDataWithIds);

    this.revalidateItemValueProcessedCache(itemIndex);
    // @ts-expect-error the stored value of an array component is a list
    this.handleValueChange(updatedValue, {
      arrayOperation: "replace",
      itemIndex,
      oldValue: dbValue
    });
  }

  cloneItem(itemIndex: number, toIndex = itemIndex + 1): void {
    const dbValue: ArrayItem<M>[] = this.getDBValue() || [];

    if (!dbValue[itemIndex]) {
      throw new Error(`Can't clone invalid item at index ${itemIndex}`);
    }

    this.revalidateItemValueProcessedCache(toIndex);
    this.insertItem(toIndex, dbValue[itemIndex]); // the object will be cloned there
  }

  reorderItem(from: number, to: number): void {
    const dbValue: ArrayItem<M>[] = this.getDBValue() || [];

    this.revalidateItemValueProcessedCache(from);
    this.revalidateItemValueProcessedCache(to);
    // @ts-expect-error the stored value of an array component is a list
    this.handleValueChange(move(from, to, dbValue), {
      arrayOperation: "moveItem"
    });
  }

  handleOpenRightSidebar(tab: string): void {
    const state = this.getReduxState();
    const dispatch = this.getReduxDispatch();

    // @ts-expect-error ui does not declare activeTab
    const { rightSidebar, activeTab } = uiSelector(state);

    if (!rightSidebar.isOpen || activeTab !== tab) {
      // @ts-expect-error isSidebarOpen is not part of the generic state
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

  handleKeyDown = (e: Event, { keyName, id }: KeyDownMeta): void => {
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
            const { offsetX = 0, offsetY = 0 } = throwOnNullish<ArrayItem>(
              "The story element has no content"
            )(v[itemIndex].value.items?.[0]).value;
            const withOffsetX = setIn(
              sourceV,
              ["value", "items", 0, "value", "offsetX"],
              offsetX
            );

            if (!isModel(withOffsetX)) {
              return sourceV;
            }

            const newV = setIn(
              withOffsetX,
              ["value", "items", 0, "value", "offsetY"],
              offsetY
            );

            if (!isModel(newV)) {
              return sourceV;
            }

            const rules = rulesSelector(this.getReduxStore().getState());
            return setOffsetsToElementFromWrapper(newV as ArrayItem<M>, rules);
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

  // @ts-expect-error the value of an array component is a list of items
  getDefaultValue(): ArrayItem<M>[] {
    return this.props.defaultValue || [];
  }

  // @ts-expect-error the value of an array component is a list of items
  getValue(): ArrayItem<M>[] {
    return this.getDBValue() || this.getDefaultValue();
  }

  // @ts-expect-error an array component has neither style nor default values
  getValue2(): { v: ArrayItem<M>[] } {
    const defaultValue = this.getDefaultValue();
    const dbValue: ArrayItem<M>[] = this.getDBValue();

    return {
      v: dbValue || defaultValue
    };
  }

  revalidateItemValueProcessedCache(itemIndex: number): void {
    if (!this._itemDefaultValueProcessedCache?.[itemIndex]) {
      return;
    }

    delete this._itemDefaultValueProcessedCache[itemIndex];
  }

  getItemDefaultValue(itemIndex: number): M {
    if (this._itemDefaultValueProcessedCache?.[itemIndex]) {
      return this._itemDefaultValueProcessedCache[itemIndex];
    }

    const v = this.getValue()[itemIndex];

    const defaultValue = getComponentDefaultValue(v.type) || {};
    const defaultValueFlat = flattenDefaultValue(defaultValue) as M;

    this._itemDefaultValueProcessedCache =
      this._itemDefaultValueProcessedCache || {};
    this._itemDefaultValueProcessedCache[itemIndex] = defaultValueFlat;

    return defaultValueFlat;
  }

  getItemStylesValue(itemIndex: number): Record<string, unknown> | null {
    const dbValue: Model<M> = this.getDBValue()[itemIndex].value;
    const currentStyleRules: Record<string, unknown> = rulesSelector(
      this.getReduxState()
    );

    if ("_styles" in dbValue && dbValue._styles && currentStyleRules) {
      return dbValue._styles.reduce<Record<string, unknown>>((acc, style) => {
        const ruleStyle = currentStyleRules[style];

        return ruleStyle ? Object.assign(acc, ruleStyle) : acc;
      }, {});
    }

    return null;
  }

  getItemValue(itemIndex: number): Model<M> {
    const defaultValue = this.getItemDefaultValue(itemIndex);
    const stylesValue = this.getItemStylesValue(itemIndex);
    const dbValue: Model<M> = this.getDBValue()[itemIndex].value;

    return { ...defaultValue, ...stylesValue, ...dbValue };
  }

  validateValue(): void {
    // always valid
  }

  getItemProps(
    itemData: ArrayItem<M>,
    itemIndex: number,
    items: ArrayItem<M>[]
  ): ItemProps {
    const { itemProps: defaultItemProps } = EditorArrayComponent.defaultProps;
    const { itemProps = defaultItemProps }: ArrayProps<M> = this.props;

    return typeof itemProps === "function"
      ? itemProps(itemData, itemIndex, items)
      : itemProps;
  }

  makeItemsToolbarPropsFromConfig2(
    config: NewToolbarConfig<M, P, S, C>,
    sidebarConfig: SidebarConfig<M, P, S, C> | null,
    // @ts-expect-error a call without options has to reach the error below
    options: ItemsToolbarOptions = {}
  ): ToolbarExtend {
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

    const getItems = (
      deviceMode: Responsive.ResponsiveMode = this.getDeviceMode()
    ): OptionDefinition[] => {
      if (process.env.NODE_ENV === "development") {
        if (!config.getItems) {
          // biome-ignore lint/suspicious/noConsole: migrated from eslint
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
          // @ts-expect-error the list stands in for the item's component
          component: this,
          device: deviceMode,
          state: stateMode,
          context: this.context
        }) ?? []
      );

      // allow extend from parent
      if (allowExtendFromParent && this.props[parentExtendProp]) {
        const { getItems }: ToolbarExtend = this.props[parentExtendProp];
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
      deviceMode: Responsive.ResponsiveMode = this.getDeviceMode()
    ): OptionDefinition[] => {
      const v = this.getItemValue(itemIndex);
      const stateMode = State.mRead(v.tabsState);
      let items = this.bindToolbarItems(
        v,
        deviceMode,
        stateMode,
        sidebarConfig?.getItems?.({
          v,
          // @ts-expect-error the list stands in for the item's component
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
        const { getSidebarItems }: ToolbarExtend = this.props[parentExtendProp];
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
        const v = this.getItemValue(itemIndex);
        title = title({ v });
      }

      // allow extend from parent
      if (allowSidebarExtendFromParent && this.props.toolbarExtend) {
        const { getSidebarTitle }: ToolbarExtend = this.props.toolbarExtend;

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

  renderItemData(
    itemData: ArrayItem<M>,
    itemKey: string | undefined,
    itemIndex: number,
    items: ArrayItem<M>[]
  ): ReactElement {
    const { renderContext, editorMode, getGlobalConfig } = this.props;
    const config = this.getGlobalConfig();

    const { type, value } = itemData;
    const ItemComponent = Editor.getComponent(type);

    const defaultValue = this.getDefaultValue();

    const itemProps = this.getItemProps(itemData, itemIndex, items);
    const itemDefaultValue = defaultValue[itemIndex]?.value;
    const itemDBValue = value;
    const itemOnChange = (
      itemValue: M | null,
      meta: ArrayMeta<M> = {}
    ): void => {
      const { intent } = meta;

      switch (intent) {
        case "replace_all": {
          const item: unknown = itemValue;

          if (isModel(item)) {
            this.replaceItem(itemIndex, item as ArrayItem<M>, meta);
          }
          break;
        }
        case "remove_all": {
          this.removeItem(itemIndex);
          break;
        }
        default: {
          this.updateItem(itemIndex, itemValue, meta);
        }
      }
    };

    if (ItemComponent) {
      // Register all ComponentTypes, used when we need to
      // know what componentType used in current Page
      this.context.componentTypes.set(type);

      return (
        <ErrorBoundary
          key={itemKey}
          config={config}
          onRemove={() => this.removeItem(itemIndex)}
          renderContext={this.props.renderContext}
        >
          {/* @ts-expect-error the list does not pass every prop that Props requires */}
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
        // @ts-expect-error the list does not pass every prop that Props requires
        <NotFoundComponent
          {...itemProps}
          key={itemKey}
          defaultValue={itemDefaultValue}
          dbValue={itemDBValue}
          reduxState={this.getReduxState()}
          reduxStore={this.getReduxStore()}
          reduxDispatch={this.getReduxDispatch()}
          onChange={itemOnChange as Props<ElementModel, ItemProps>["onChange"]}
          componentId={type}
          renderContext={this.props.renderContext}
          editorMode={this.props.editorMode}
          getGlobalConfig={getGlobalConfig}
        />
      );
    }
  }

  renderItemWrapper(
    item: ReactElement,
    itemKey: string | undefined,
    _itemIndex: number,
    itemData: ArrayItem<M>,
    _items: ArrayItem<M>[]
  ): ReactElement {
    return (
      <Profiler
        key={itemKey}
        id={`Editor.Array.${itemData.type}`}
        onRender={onRenderArray}
      >
        {item}
      </Profiler>
    );
  }

  renderItem = (
    itemData: ArrayItem<M>,
    itemIndex: number,
    items: ArrayItem<M>[]
  ): ReactElement | null => {
    const {
      sliceStartIndex: defaultSliceStartIndex,
      sliceEndIndex: defaultSliceEndIndex
    } = EditorArrayComponent.defaultProps;
    const {
      sliceStartIndex = defaultSliceStartIndex,
      sliceEndIndex = defaultSliceEndIndex
    }: ArrayProps<M> = this.props;

    // allows rendering of a slice of the items
    if (itemIndex >= sliceStartIndex && itemIndex < sliceEndIndex) {
      const itemKey = itemData.value._id;
      const item = this.renderItemData(itemData, itemKey, itemIndex, items);

      return this.renderItemWrapper(item, itemKey, itemIndex, itemData, items);
    } else {
      return null;
    }
  };

  // the lists that hold columns override it
  addColumn(_itemIndex: number): void {
    throw new Error("Only the lists that hold columns can add one");
  }

  getAlignments(): string[] {
    return ["top", "center", "bottom"];
  }

  renderItemsContainer(
    items: Array<ReactElement | null>,
    _v: ArrayItem<M>[]
  ): ReactNode {
    return items;
  }

  // @ts-expect-error the value of an array component is a list of items
  renderForEdit(v: ArrayItem<M>[]): ReactNode {
    const items = v.map(this.renderItem);

    return this.renderItemsContainer(items, v);
  }

  getIdBindKey(): { id: string; bindKey: string } {
    const id = this.getId();
    const [uid, bindWithKey] = id.split("-");

    return {
      id: uid,
      bindKey: bindWithKey
    };
  }

  getMenuData(): MenuData {
    return menuDataSelector(this.getReduxStore().getState());
  }

  getCurrentCopiedElement = (): ArrayItem<M> | null => {
    const { path, value } = copiedElementNoRefsSelector(
      this.getReduxStore().getState()
    );

    if (value && path.length > 0) {
      const copied = getIn(attachMenu(value, this.getMenuData()), path);

      return isModel(copied) ? (copied as ArrayItem<M>) : null;
    }

    return null;
  };

  changeVerticalAlign(index: number, alignDirection: AlignDirection): void {
    const v = this.getValue();
    const data = pageDataNoRefsSelector(this.getReduxStore().getState());
    const activeElementId =
      global.Brizy.activeEditorComponent.getHotKeysTargetId();
    const activeElementPath = createFullModelPath(data, [activeElementId]);

    const {
      path,
      value: parentValue
    }: { path: string[] | null; value: unknown } =
      getParentWhichContainsStyleProperty(
        activeElementPath,
        data,
        "verticalAlign"
      );

    if (isModel(parentValue) && path) {
      const { type, value } = parentValue;
      const alignList = this.getAlignments();
      const { verticalAlign } = throwOnNullish<DefaultStyle>(
        `${type} has no default style`
      )(
        throwOnNullish<typeof EditorComponent>(`${type} is not registered`)(
          Editor.getComponent(type) ?? undefined
        ).defaultValue.style
      );
      const currentAlign = value.verticalAlign || verticalAlign || "top";
      const nextAlign = getElementOfArrayLoop(
        alignList,
        currentAlign,
        alignDirection
      );

      const { id, bindKey } = this.getIdBindKey();
      const pathUid = bindKey ? [id, bindKey, `${index}`] : [id, `${index}`];
      const currentPath = createFullModelPath(data, pathUid);
      const newPath = path.reduce<string[]>((acc, _item, index) => {
        if (currentPath[index] === undefined) {
          acc.push(path[index]);
        }

        return acc;
      }, []);

      if (newPath.length === 0) {
        this.updateItem(index, { ...(value as M), verticalAlign: nextAlign });
      } else {
        const newValue = setIn(v, [...newPath, "value"], {
          ...value,
          verticalAlign: nextAlign
        });
        const item = Array.isArray(newValue) ? newValue[index] : undefined;

        if (!isModel(item)) {
          throw new Error(`The list has no item at index ${index}`);
        }

        this.updateItem(index, item.value as M);
      }
    }
  }

  changeHorizontalAlign(index: number, alignDirection: AlignDirection): void {
    const v = this.getValue();
    const activeElementId =
      global.Brizy.activeEditorComponent.getHotKeysTargetId();
    const state = this.getReduxStore().getState();
    const data = pageDataNoRefsSelector(state);
    const activeElementPath = createFullModelPath(data, [activeElementId]);

    const { deviceMode } = state.ui;
    const alignName =
      deviceMode === "desktop"
        ? "horizontalAlign"
        : `${deviceMode}HorizontalAlign`;

    const {
      path,
      value: parentValue
    }: { path: string[] | null; value: unknown } =
      getParentWhichContainsStyleProperty(activeElementPath, data, alignName);

    if (isModel(parentValue) && path) {
      const { type, value } = parentValue;
      const alignList = ["left", "center", "right"];
      const {
        defaultValue: { style }
      } = throwOnNullish<typeof EditorComponent>(`${type} is not registered`)(
        Editor.getComponent(type) ?? undefined
      );
      const currentAlign =
        value[alignName] ||
        throwOnNullish<DefaultStyle>(`${type} has no default style`)(style)[
          alignName
        ] ||
        "left";
      const nextAlign = getElementOfArrayLoop(
        alignList,
        currentAlign,
        alignDirection
      );

      const { id, bindKey } = this.getIdBindKey();
      const pathUid = bindKey ? [id, bindKey, `${index}`] : [id, `${index}`];
      const currentPath = createFullModelPath(data, pathUid);
      const newPath = path.reduce<string[]>((acc, _item, index) => {
        if (currentPath[index] === undefined) {
          acc.push(path[index]);
        }

        return acc;
      }, []);

      if (newPath.length === 0) {
        this.updateItem(index, { ...(value as M), [alignName]: nextAlign });
      } else {
        const newValue = setIn(v, [...newPath, "value"], {
          ...value,
          [alignName]: nextAlign
        });
        const item = Array.isArray(newValue) ? newValue[index] : undefined;

        if (!isModel(item)) {
          throw new Error(`The list has no item at index ${index}`);
        }

        this.updateItem(index, item.value as M);
      }
    }
  }

  copy(index: number): void {
    const dispatch = this.getReduxDispatch();
    const data = pageDataNoRefsSelector(this.getReduxState());
    const { id, bindKey } = this.getIdBindKey();
    const pathUid = bindKey ? [id, bindKey, `${index}`] : [id, `${index}`];
    const shortcodePath = createFullModelPath(data, pathUid);
    const pageData = attachMenu(data, this.getMenuData());

    dispatch(
      updateCopiedElement({
        value: pageData,
        path: shortcodePath
      })
    );
  }

  // cb = v => v -> it's needed for cases when we want to change somehow final value
  paste(index: number, cb: (v: ArrayItem<M>) => ArrayItem<M> = (v) => v): void {
    const v = this.getValue()[index];
    const { path, value: copiedValue } = copiedElementNoRefsSelector(
      this.getReduxStore().getState()
    );
    if (!copiedValue) {
      return;
    }

    const { value } = getClosestParent(
      path,
      attachMenu(copiedValue, this.getMenuData()),
      v.type === "Cloneable" || v.type === "Wrapper"
        ? ({ type }: ArrayItem) => type === "Cloneable" || type === "Wrapper"
        : ({ type }: ArrayItem) => type === v.type
    );
    if (isModel(value)) {
      this.insertItem(index + 1, cb(value));
    }
  }

  pasteStyles(index: number): void {
    performance.mark("pasteStyles:start");

    const { path, value: copiedValue } = copiedElementNoRefsSelector(
      this.getReduxStore().getState()
    );
    if (!copiedValue) {
      performance.measure("pasteStyles", "pasteStyles:start");
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
        const copiedInner = throwOnNullish<ElementModelType>(
          `${copiedElement.type} has no content`
        )(copiedElement.value.items?.[0]);
        const inner = throwOnNullish<ElementModelType>(
          `${v.type} has no content`
        )(v.value.items?.[0]);

        if (copiedInner.type !== inner.type) {
          performance.measure("pasteStyles", "pasteStyles:start");
          return;
        }

        depth = 1;
        if (
          copiedInner.type === "Form" ||
          copiedInner.type === "IconText" ||
          copiedInner.type === "Form2"
        ) {
          depth = 3;
        } else if (copiedInner.type === "ImageGallery") {
          depth = 2;
        }
      }
    }

    const { value } = getClosestParent(
      path,
      attachMenu(copiedValue, this.getMenuData()),
      ({ type }: ArrayItem) => type === v.type
    );

    performance.mark("pasteStyles:setStyles");
    const rules = rulesSelector(this.getReduxStore().getState());

    if (value) {
      const newValue = setStyles({
        depth,
        componentValue: value,
        deviceMode: this.getDeviceMode(),
        rules
      });

      performance.measure("pasteStyles:compute", "pasteStyles:setStyles");

      if (isModel(newValue)) {
        const mergedValue = deepMerge<ArrayItem<M>, ElementModelType>(
          v,
          newValue,
          {
            arrayMerge: combineMerge
          }
        );

        performance.mark("pasteStyles:updateItem");
        this.updateItem(index, mergedValue.value);
        performance.measure("pasteStyles:redux", "pasteStyles:updateItem");
      }
    }

    performance.measure("pasteStyles", "pasteStyles:start");
  }
}

function attachMenu<T extends Record<string, unknown>>(
  value: T,
  menusConfig: MenuData
): T {
  return mapModels((block: ElementModelType) => {
    const { type, value } = block;

    if (type === "Menu") {
      const { menuSelected: dbMenuSelected, symbols = {} } = value;
      const menuSelected = dbMenuSelected || menusConfig[0]?.id;

      if (menuSelected) {
        const menuConfig: Partial<MenuData[number]> =
          menusConfig.find((menu) => menu.id === menuSelected) || {};

        return produce(block, (draft) => {
          // @ts-expect-error the menu helpers type items and symbols as plain models
          draft.value.items = symbolsToItems(menuConfig.items || [], symbols);
        });
      }
    }

    return block;
  }, value);
}
