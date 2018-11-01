import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./items";
import { styleClassName, styleCSSVars } from "./styles";
import * as parentToolbarExtend from "./parentToolbarExtend";
import defaultValue from "./defaultValue.json";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

class Posts extends EditorComponent {
  static get componentId() {
    return "Posts";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false
    });
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

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.paginationColorPalette &&
        `${_v.paginationColorPalette}__paginationColor`
    ]);
    const {
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      gridRow,
      gridColumn,
      pagination
    } = v;

    const itemsProps = this.makeSubcomponentProps({
      className: styleClassName(v),
      style: styleCSSVars(v),
      bindWithKey: "items",
      gridRow,
      gridColumn,
      taxonomy,
      taxonomyId,
      order,
      orderBy,
      pagination: pagination === "on",
      meta: this.getMeta(v)
    });

    return <Items {...itemsProps} />;
  }
}
export default Posts;
