import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./items";
import { styleClassName, styleCSSVars } from "./styles";
import * as parentToolbarExtend from "./parentToolbarExtend";
import defaultValue from "./defaultValue.json";

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
    const { gridColumn, padding } = v;
    const desktopW = meta.desktopW / gridColumn;

    return {
      ...meta,
      desktopW: Math.round((desktopW - padding) * 10) / 10,
      inGrid: false,
      posts: true
    };
  }

  renderForEdit(v) {
    const { taxonomy, taxonomyId, gridRow, gridColumn } = v;

    const itemsProps = this.makeSubcomponentProps({
      className: styleClassName(v),
      style: styleCSSVars(v),
      bindWithKey: "items",
      gridRow,
      gridColumn,
      taxonomy,
      taxonomyId,
      meta: this.getMeta(v)
    });

    return <Items {...itemsProps} />;
  }
}
export default Posts;
