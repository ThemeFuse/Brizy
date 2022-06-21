import React from "react";
import _ from "underscore";
import { setIn, mergeDeep } from "timm";
import deepMerge from "deepmerge";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import HotKeys from "visual/component/HotKeys";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { hideToolbar } from "visual/component/Toolbar";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { clamp, isNumeric } from "visual/utils/math";
import { attachRef } from "visual/utils/react";
import { getStore } from "visual/redux/store";
import { deviceModeSelector } from "visual/redux/selectors";
import { defaultValueKey } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import { normalizeRowColumns, getElemWidthWithoutPaddings } from "./utils";
import * as N from "visual/utils/math/number";

const MAX_ITEMS_IN_ROW = 6;

const toDecimalTen = number => Math.round(number * 10) / 10;

class RowItems extends EditorArrayComponent {
  static get componentId() {
    return "Row.Items";
  }

  static defaultProps = {
    containerClassName: "",
    meta: {},
    itemProps: {}
  };

  nodeRef = React.createRef();

  columnWidths = null;

  popoverData = null;

  state = {
    patch: null,
    isDragging: false,
    deltaX: 0
  };

  getDBValue() {
    if (this.state.patch) {
      return mergeDeep(this.props.dbValue, this.state.patch);
    } else {
      return this.props.dbValue;
    }
  }

  handleValueChange(value, meta = {}) {
    const { arrayOperation } = meta;
    const afterCloneOrRemove =
      arrayOperation === "insert" || arrayOperation === "remove";
    const newValue = afterCloneOrRemove ? normalizeRowColumns(value) : value;

    if (afterCloneOrRemove) {
      this.columnWidths = this.getColumnWidthsInPx();
    }
    super.handleValueChange(newValue, meta);
  }

  componentDidMount() {
    this.columnWidths = this.getColumnWidthsInPx();
  }

  handleColumnResizeStart = (index, deltaX, position) => {
    const node = this.nodeRef.current;

    this.columnWidths = this.getColumnWidthsInPx();
    this.containerWidth = getElemWidthWithoutPaddings(node);

    this.handleColumnResize(index, deltaX, position);
  };

  handleColumnResizeEnd = (itemIndex, position) => {
    this.setState({ patch: null, isDragging: false }, () =>
      this.handleColumnResize(itemIndex, this.state.deltaX, position)
    );
    // this.columnWidths = null;
    this.containerWidth = null;
    this.popoverData = null;
  };

  handleColumnResize = (index, deltaX, position) => {
    const { col1Index } = this.getColumnIndexesByPosition(index, position);

    const colWidthPx = this.columnWidths[col1Index] + deltaX;
    const colWidthPercent = toDecimalTen(
      (colWidthPx * 100) / this.containerWidth
    );

    if (this.state.isDragging) {
      this.setState({ deltaX });
    }
    this.changeColumnWidths(index, colWidthPercent, position);
  };

  changeColumnWidths(index, valueInPercent, position) {
    const dbValue = this.getDBValue();
    const device = deviceModeSelector(getStore().getState());
    const widthKey = defaultValueKey({ key: "width", device });

    const { min, max } = this.getColumnWidthLimitsPercent(index, position);
    const { col1Index, col2Index } = this.getColumnIndexesByPosition(
      index,
      position
    );

    valueInPercent = clamp(valueInPercent, min, max);

    const col1WidthPercent = toDecimalTen(valueInPercent);

    const popoverData = [col1WidthPercent];

    let newValue = setIn(
      dbValue,
      [col1Index, "value", widthKey],
      col1WidthPercent
    );

    // for desktop we should change width and for sibling
    if (device === "desktop") {
      const currentCol1Width = this.getColumnWidthByIndex(col1Index);
      const currentCol2Width = this.getColumnWidthByIndex(col2Index);

      const col2WidthPercent = toDecimalTen(
        currentCol1Width + (currentCol2Width - valueInPercent)
      );

      popoverData.push(col2WidthPercent);

      newValue = setIn(
        newValue,
        [col2Index, "value", widthKey],
        col2WidthPercent
      );
    }

    this.popoverData = popoverData;

    if (this.state.isDragging) {
      this.setState(state => ({ ...state, patch: newValue }));
    } else {
      this.handleValueChange(newValue);
    }
  }

  getColumnWidthByIndex(index) {
    const dbValue = this.getDBValue();
    const device = deviceModeSelector(getStore().getState());
    const widthKey = defaultValueKey({ key: "width", device });
    // by default column has width = 50, but it doesn't contain into db
    // if component wasn't changed this way we use || 50 for desktop
    // and tablet and 100 for mobile

    switch (device) {
      case "desktop":
        return N.read(dbValue[index]?.value?.[widthKey]) ?? 50;
      case "tablet": {
        return (
          N.read(dbValue[index]?.value?.[widthKey]) ??
          N.read(dbValue[index]?.value?.["width"]) ??
          50
        );
      }
    }

    return N.read(dbValue[index]?.value?.[widthKey]) ?? 100;
  }

  getColumnIndexesByPosition(index, position) {
    let col1Index = index;
    let col2Index = index + 1;

    // is it a good solution?
    if (this.props.dbValue.length - 1 === index) {
      col2Index = index - 1;
      col1Index = index;
    }

    if (position === "left") {
      col1Index = index - 1;
      col2Index = index;
    }

    return {
      col1Index,
      col2Index
    };
  }

  getColumnWidthLimitsPercent(index, position, columnWidths) {
    const device = deviceModeSelector(getStore().getState());
    if (device !== "desktop") {
      return { min: 5, max: 100 };
    }

    const { col1Index, col2Index } = this.getColumnIndexesByPosition(
      index,
      position
    );

    const currentCol1Width = this.getColumnWidthByIndex(col1Index);
    const currentCol2Width = this.getColumnWidthByIndex(col2Index);

    // It's a hack. Find out a better way to implement this
    const columnWidthInPx =
      columnWidths?.[col1Index] || this.getColumnWidthsInPx()[col1Index];

    const minWidth = (MIN_COL_WIDTH * currentCol1Width) / columnWidthInPx;

    const maxWidthOf2Columns = currentCol1Width + currentCol2Width;

    const maxWidth = maxWidthOf2Columns - minWidth;

    const min = toDecimalTen(minWidth);
    const max = toDecimalTen(maxWidth);

    return { min: isNumeric(min) ? min : 5, max: isNumeric(max) ? max : 100 };
  }

  getItemProps(itemData, itemIndex, items) {
    const isOnly = items.length === 1;
    const meta = deepMerge(this.props.meta, {
      row: {
        item: {
          index: itemIndex,
          isFirst: itemIndex === 0,
          isLast: itemIndex === items.length - 1,
          isOnly
        }
      }
    });

    const getConfig = device => {
      const position = items.length - 1 === itemIndex ? "left" : "right";
      const { min, max } = this.getColumnWidthLimitsPercent(
        itemIndex,
        position,
        this.columnWidths
      );
      const columnWidthConfig = !isOnly
        ? {
            id: "toolbarSettings",
            type: "popover-dev",
            config: {
              icon: "nc-cog",
              title: t("Settings")
            },
            options: [
              {
                id: "width",
                label: t("Width"),
                type: "slider",
                position: 105,
                inputType: "number",
                slider: {
                  min,
                  max,
                  step: 0.1
                },
                input: {
                  show: true,
                  min,
                  max,
                  step: 0.1
                },
                value: {
                  value: this.getColumnWidthByIndex(itemIndex)
                },
                suffix: {
                  show: true,
                  choices: [{ title: "%", value: "%" }]
                },
                onChange: ({ value }) =>
                  this.changeColumnWidths(itemIndex, value, "right")
              }
            ]
          }
        : {};

      const cloneRemoveConfig = [
        {
          id: "order",
          type: "order-dev",
          devices: "desktop",
          position: 105,
          roles: ["admin"],
          disabled: items.length < 2,
          config: {
            disable:
              itemIndex === 0
                ? "prev"
                : itemIndex === items.length - 1
                ? "next"
                : undefined,
            onChange: v => {
              switch (v) {
                case "prev":
                  this.reorderItem(itemIndex, itemIndex - 1);
                  break;
                case "next":
                  this.reorderItem(itemIndex, itemIndex + 1);
                  break;
              }
            }
          }
        },
        ...(this.canAddColumn()
          ? [
              {
                id: "emptyItem",
                type: "button",
                icon: "nc-add",
                title: t("Add New Column"),
                position: 100,
                onChange: () => {
                  this.addColumn(itemIndex + 1);
                }
              },
              {
                id: "duplicate",
                type: "button",
                icon: "nc-duplicate",
                title: t("Duplicate"),
                position: 200,
                onChange: () => {
                  this.cloneItem(itemIndex);
                }
              }
            ]
          : []),
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          icon: "nc-trash",
          position: 250,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ];

      let config = [columnWidthConfig];
      if (device === "desktop") {
        config.push(...cloneRemoveConfig);
      }

      return config;
    };

    const toolbarConfig = {
      getItemsForDesktop: () => getConfig("desktop"),
      getItemsForTablet: () => getConfig("tablet"),
      getItemsForMobile: () => getConfig("mobile")
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig(toolbarConfig);

    return {
      ...this.props.itemProps,
      tabletReversed: this.props.tabletReversed,
      mobileReversed: this.props.mobileReversed,
      meta,
      toolbarExtend,
      popoverData: this.getPopoverData,
      onResizeStart: position => {
        this.setState({ isDragging: true }, () =>
          this.handleColumnResizeStart(itemIndex, 0, position)
        );
      },
      onResize: (deltaX, position) =>
        this.handleColumnResize(itemIndex, deltaX, position),
      onResizeEnd: position => this.handleColumnResizeEnd(itemIndex, position)
    };
  }

  handleSortableAcceptElements = (from, to) => {
    if (from.elementType === "addable") {
      const addableSubtype = from.elementNode.getAttribute(
        "data-sortable-subtype"
      );

      if (addableSubtype === "row") {
        return false;
      }
    }

    const sameNode = from.sortableNode === to.sortableNode;
    const acceptsElement =
      ["column", "shortcode", "addable"].indexOf(from.elementType) !== -1;
    const hasEnoughSpace = to.sortableNode.children.length < MAX_ITEMS_IN_ROW;

    return sameNode || (acceptsElement && hasEnoughSpace);
  };

  getColumnWidthsInPx = () => {
    const node = this.nodeRef.current;

    if (node) {
      return _.map(node.children, elem => elem.getBoundingClientRect().width);
    }

    return [];
  };

  getPopoverData = () => {
    return this.popoverData;
  };

  canAddColumn() {
    const v = this.getValue();

    return v.length < MAX_ITEMS_IN_ROW;
  }

  addColumn(index) {
    const v = this.getValue();
    const itemData = {
      ...v[0],
      value: {
        items: []
      }
    };

    this.insertItem(index, itemData);
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const keyNames = [
      "alt+N",
      "ctrl+N",
      "cmd+N",
      "right_cmd+N",
      "alt+D",
      "alt+C",
      "alt+V",
      "alt+shift+V",
      "shift+alt+V",
      "alt+del",
      "alt+up",
      "alt+down"
    ];

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "horizontalAlign",
      "verticalAlign",
      "showSidebarStyling",
      "showSidebarAdvanced",
      "width",
      "tabletWidth",
      "mobileWidth"
    ];

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <HotKeys
          keyNames={keyNames}
          shortcutsTypes={shortcutsTypes}
          id={itemKey}
          onKeyDown={this.handleKeyDown}
        >
          {item}
        </HotKeys>
      </ContextMenuExtend>
    );
  }

  renderItemsContainer(items) {
    const { containerClassName: className } = this.props;

    if (IS_PREVIEW) {
      return <div className={className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <div className={className}>
          <SortableEmpty
            path={this.getId()}
            type="row"
            isGrid={true}
            acceptElements={this.handleSortableAcceptElements}
          />
        </div>
      );
    }

    return (
      <Sortable
        path={this.getId()}
        type="row"
        isGrid={true}
        acceptElements={this.handleSortableAcceptElements}
      >
        {(sortableRef, sortableAttr) => (
          <div
            {...sortableAttr}
            ref={v => {
              attachRef(v, sortableRef);
              attachRef(v, this.nodeRef);
            }}
            className={className}
          >
            {items}
          </div>
        )}
      </Sortable>
    );
  }
}

export default RowItems;
