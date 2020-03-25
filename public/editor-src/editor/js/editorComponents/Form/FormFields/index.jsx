import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./Items";
import * as toolbarExtend from "./toolbarExtend";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

export default class FormItem extends EditorComponent {
  static get componentId() {
    return "FormFields";
  }

  static defaultValue = defaultValue;

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend)
    });

    return (
      <div className={styleClassName(v)} style={styleCSSVars(v)}>
        <Items {...itemsProps} />
      </div>
    );
  }
}
