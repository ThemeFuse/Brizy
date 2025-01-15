import classnames from "classnames";
import React from "react";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";

export default class FormItem extends EditorComponent<ElementModel> {
  static get componentId(): ElementTypes.FormFields {
    return ElementTypes.FormFields;
  }

  static defaultValue = defaultValue;

  renderForEdit(v: ElementModel, vs: ElementModel, vd: ElementModel) {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      // @ts-expect-error: need to transform in .ts
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend)
    });

    const _className = classnames(
      "brz-forms__fields",
      this.css(
        `${this.getComponentId()}-fields`,
        `${this.getId()}-fields`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    return (
      <div className={_className}>
        {/* @ts-expect-error: need review when EditorArrayComponent converted to TS */}
        <Items {...itemsProps} />
      </div>
    );
  }
}
