import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import FormItemItems from "./ItemItems";
import * as toolbarExtendConfigItems from "./extendToolbarItems";
import defaultValue from "./fieldsDefaultValue.json";
import { fieldsStyleClassName, fieldsStyleCSSVars } from "./styles";

class FormItem extends EditorComponent {
  static get componentId() {
    return "FormFields";
  }

  static defaultValue = defaultValue;

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfigItems, {
        allowExtend: false
      })
    });

    const style = {
      ...fieldsStyleCSSVars(v)
    };

    return (
      <div className={fieldsStyleClassName(v)} style={style}>
        <FormItemItems {...itemsProps} />
      </div>
    );
  }
}

export default FormItem;
