import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import { setIn } from "timm";
import deepMerge from "deepmerge";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import { hideToolbar } from "visual/component/Toolbar/index";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { clamp } from "visual/utils/math";
import { normalizeRowColumns } from "./utils";
import { t } from "visual/utils/i18n";
import { getStore } from "visual/redux/store";

const MAX_ITEMS_IN_ROW = 6;

const toDecimalTen = number => Math.round(number * 10) / 10;

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Row.Items";
  }

  static defaultProps = {
    containerClassName: "",
    meta: {},
    itemProps: {}
  };

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
        this.handleTabletColumnResize(index, deltaX, position);
        break;
      case "mobile":
        this.handleMobileColumnResize(index, deltaX, position);
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

    const allColumnsWidth = _.reduce(
      this.columnWidths,
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

  handleTabletColumnResize = (index, deltaX) => {
    const { tabletW } = this.props.meta;
    this.columnWidths = this.columnWidths || this.getColumnWidthsInPx();

    const colWidthPx = clamp(
      this.columnWidths[index] + deltaX,
      MIN_COL_WIDTH,
      tabletW
    );
    const colWidthPercent = toDecimalTen((colWidthPx * 100) / tabletW);

    this.popoverData = [colWidthPercent];

    let newValue = setIn(
      this.getDBValue(),
      [index, "value", "tabletWidth"],
      colWidthPercent
    );

    this.handleValueChange(newValue);
  };

  handleMobileColumnResize = (index, deltaX) => {
    const { mobileW } = this.props.meta;
    this.columnWidths = this.columnWidths || this.getColumnWidthsInPx();

    const colWidthPx = clamp(
      this.columnWidths[index] + deltaX,
      MIN_COL_WIDTH,
      mobileW
    );
    const colWidthPercent = toDecimalTen((colWidthPx * 100) / mobileW);

    this.popoverData = [colWidthPercent];

    let newValue = setIn(
      this.getDBValue(),
      [index, "value", "mobileWidth"],
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

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        {item}
      </ContextMenuExtend>
    );
  }

  renderItemsContainer(items) {
    if (IS_PREVIEW) {
      return <div className={this.props.containerClassName}>{items}</div>;
    }

    const sortableContent = items.length ? (
      <div className={this.props.containerClassName}>{items}</div>
    ) : null;

    return (
      <Sortable
        path={this.getPath()}
        type="row"
        isGrid={true}
        acceptElements={this.handleSortableAcceptElements}
      >
        {sortableContent}
      </Sortable>
    );
  }
}

export default Items;
