import React from "react";
import classnames from "classnames";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import toolbarExtendParentFn from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendPagination from "./toolbarExtendPagination";
import * as sidebarExtendPagination from "./sidebarExtendPagination";
import * as toolbarExtendFilter from "./toolbarExtendFilter";
import * as sidebarExtendFilter from "./sidebarExtendFilter";
import { IS_WP } from "visual/utils/env";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import { tabletSyncOnChange } from "visual/utils/onChange";
import { symbolsToV, vToSymbols } from "./utils.common";
import { getLoopAttributes } from "./utils";
import { getCollectionTypesInfo } from "./toolbarExtendParent/utils";

import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { migrations } from "./migrations";

export class Posts extends EditorComponent {
  static get componentId() {
    return "Posts";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  async componentDidMount() {
    let context;

    if (!IS_WP) {
      const collectionTypesInfo = await getCollectionTypesInfo();
      context = { collectionTypesInfo };
    }

    const toolbarExtendParent = toolbarExtendParentFn(context);
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      { allowExtend: false }
    );

    this.props.extendParentToolbar(toolbarExtend);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(vToSymbols(newValue), meta);
  }

  getValue2() {
    const values = super.getValue2();
    const v = symbolsToV(values.v);

    return v === values.v ? values : Object.assign(values, { v });
  }

  getMeta(v) {
    const { meta } = this.props;
    const { gridColumn, padding, tabletGridColumn } = v;
    const desktopW = meta.desktopW / gridColumn;
    const desktopWNoSpacing = meta.desktopWNoSpacing / gridColumn;
    const tabletW = meta.tabletW / tabletGridColumn;
    const tabletWNoSpacing = meta.tabletWNoSpacing / tabletGridColumn;

    const tabletPadding = tabletSyncOnChange(v, "padding");

    return {
      ...meta,
      desktopW: Math.round((desktopW - padding) * 10) / 10,
      desktopWNoSpacing,
      tabletW: Math.round((tabletW - tabletPadding) * 10) / 10,
      tabletWNoSpacing,
      inGrid: false,
      posts: true
    };
  }

  renderForEdit(v, vs, vd) {
    const { type, gridRow, gridColumn, pagination, filter, filterStyle } = v;
    const className = classnames(
      "brz-posts",
      { "brz-posts--masonry": filter === "on" },
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      type,
      className,
      rowCount: gridRow,
      columnCount: gridColumn,
      meta: this.getMeta(v),
      showPagination: pagination === "on",
      toolbarExtendPagination: this.makeToolbarPropsFromConfig2(
        toolbarExtendPagination,
        sidebarExtendPagination,
        {
          allowExtend: false
        }
      ),
      showFilter: filter === "on",
      filterStyle,
      toolbarExtendFilter: this.makeToolbarPropsFromConfig2(
        toolbarExtendFilter,
        sidebarExtendFilter,
        {
          allowExtend: false
        }
      ),
      loopAttributes: IS_EDITOR ? undefined : getLoopAttributes(v)
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemsProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default withMigrations(Posts, migrations);
