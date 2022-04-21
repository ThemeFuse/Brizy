import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import { setIn } from "timm";
import deepMerge from "deepmerge";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import HotKeys from "visual/component/HotKeys";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { hideToolbar } from "visual/component/Toolbar/index";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { clamp } from "visual/utils/math";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";
import { normalizeRowColumns } from "./utils";

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

  handleValueChange(value, meta = {}) {
    const { arrayOperation } = meta;
    const afterCloneOrRemove =
      arrayOperation === "insert" || arrayOperation === "remove";
    const newValue = afterCloneOrRemove ? normalizeRowColumns(value) : value;

    super.handleValueChange(newValue, meta);
  }

  handleColumnResize = (index, deltaX, position) => {
    const { deviceMode } = getStore().getState().ui;

    switch (deviceMode) {
      case "desktop":
        this.handleDesktopColumnResize(index, deltaX, position);
        break;
      case "tablet":
        this.handleDeviceColumnResize(index, deltaX, "tabletWidth");
        break;
      case "mobile":
        this.handleDeviceColumnResize(index, deltaX, "mobileWidth");
        break;
      default:
        console.error("Invalid Column Resize. This should not happen");
    }
  };

  handleDesktopColumnResize = (index, deltaX, position) => {
    this.columnWidths = this.columnWidths || this.getColumnWidthsInPx();

    let col1Index = index;
    let col2Index = index + 1;

    if (position === "left") {
      col1Index = index - 1;
      col2Index = index;
    }

    const allColumnsWidth = this.columnWidths.reduce(
      (memo, num) => memo + num,
      0
    );
    const restColumnsWidth =
      allColumnsWidth -
      this.columnWidths[col1Index] -
      this.columnWidths[col2Index];
    const maxColumnWidth = allColumnsWidth - restColumnsWidth - MIN_COL_WIDTH;

    const col1WidthPx = clamp(
      this.columnWidths[col1Index] + deltaX, // when deltaX is negative, adding results to subtracting
      MIN_COL_WIDTH,
      maxColumnWidth
    );
    const col2WidthPx = clamp(
      this.columnWidths[col2Index] - deltaX, // when x is negative, subtracting results to adding because of double minus
      MIN_COL_WIDTH,
      maxColumnWidth
    );
    const col1WidthPercent = toDecimalTen(
      (col1WidthPx * 100) / allColumnsWidth
    );
    const col2WidthPercent = toDecimalTen(
      (col2WidthPx * 100) / allColumnsWidth
    );

    this.popoverData = [col1WidthPercent, col2WidthPercent];

    let newValue = setIn(
      this.getDBValue(),
      [col1Index, "value", "width"],
      col1WidthPercent
    );
    newValue = setIn(newValue, [col2Index, "value", "width"], col2WidthPercent);

    this.handleValueChange(newValue);
  };

  handleDeviceColumnResize = (index, deltaX, key) => {
    this.columnWidths = this.columnWidths || this.getColumnWidthsInPx();
    const node = this.nodeRef.current;
    const parentWidth = node.getBoundingClientRect().width;
    const colWidthPx = clamp(
      this.columnWidths[index] + deltaX,
      MIN_COL_WIDTH,
      parentWidth
    );
    const colWidthPercent = toDecimalTen((colWidthPx * 100) / parentWidth);

    this.popoverData = [colWidthPercent];

    const newValue = setIn(
      this.getDBValue(),
      [index, "value", key],
      colWidthPercent
    );

    this.handleValueChange(newValue);
  };

  handleColumnResizeEnd = () => {
    this.columnWidths = null;
    this.popoverData = null;
  };

  getItemProps(itemData, itemIndex, items) {
    const meta = deepMerge(this.props.meta, {
      row: {
        item: {
          index: itemIndex,
          isFirst: itemIndex === 0,
          isLast: itemIndex === items.length - 1,
          isOnly: items.length === 1
        }
      }
    });
    const cloneRemoveConfig = {
      getItemsForDesktop: () => [
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
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig(cloneRemoveConfig);

    return {
      ...this.props.itemProps,
      tabletReversed: this.props.tabletReversed,
      mobileReversed: this.props.mobileReversed,
      meta,
      toolbarExtend,
      popoverData: this.getPopoverData,
      onResizeStart: position =>
        this.handleColumnResize(itemIndex, 0, position),
      onResize: (deltaX, position) =>
        this.handleColumnResize(itemIndex, deltaX, position),
      onResizeEnd: this.handleColumnResizeEnd
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
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    return _.map(node.children, elem => elem.getBoundingClientRect().width);
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
      "verticalAlign"
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
    if (IS_PREVIEW) {
      return <div className={this.props.containerClassName}>{items}</div>;
    }

    const sortableContent = items.length ? (
      <div ref={this.nodeRef} className={this.props.containerClassName}>
        {items}
      </div>
    ) : null;

    return (
      <Sortable
        path={this.getId()}
        type="row"
        isGrid={true}
        acceptElements={this.handleSortableAcceptElements}
      >
        {sortableContent}
      </Sortable>
    );
  }
}

export default RowItems;
