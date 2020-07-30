import React from "react";
import classnames from "classnames";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { tabletSyncOnChange } from "visual/utils/onChange";
import * as toolbarExtendPagination from "./toolbarExtendPagination";
import * as sidebarExtendPagination from "./sidebarExtendPagination";
import * as toolbarExtendFilter from "./toolbarExtendFilter";
import * as sidebarExtendFilter from "./sidebarExtendFilter";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";

class Posts extends EditorComponent {
  static get componentId() {
    return "Posts";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  getMeta(v) {
    const { meta } = this.props;
    const { gridColumn, padding, tabletGridColumn } = v;
    const desktopW = meta.desktopW / gridColumn;
    const tabletW = meta.tabletW / tabletGridColumn;

    const tabletPadding = tabletSyncOnChange(v, "padding");

    return {
      ...meta,
      desktopW: Math.round((desktopW - padding) * 10) / 10,
      tabletW: Math.round((tabletW - tabletPadding) * 10) / 10,
      inGrid: false,
      posts: true
    };
  }

  renderForEdit(v, vs, vd) {
    const {
      type,
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      gridRow,
      gridColumn,
      pagination,
      filter,
      filterStyle
    } = v;
    const className = classnames(
      "brz-posts",
      { "brz-posts--masonry": filter === "on" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
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
      loopAttributes: {
        ...(type === "posts"
          ? {
              query: {
                tax_query: {
                  0: {
                    taxonomy,
                    field: "id",
                    terms: taxonomyId
                  }
                },
                posts_per_page: gridRow * gridColumn,
                order,
                orderby: orderBy
              }
            }
          : {
              query: "",
              count: gridRow * gridColumn
            })
      }
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
export default Posts;
