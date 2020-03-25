import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import Form2FieldsItems from "./Items";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as toolbarExtendSelect from "./toolbarExtendSelect";
import * as sidebarExtendSelect from "./sidebarExtendSelect";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { styleFormFields, styleFormSelect } from "./styles";

class Form2Fields extends EditorComponent {
  static get componentId() {
    return "Form2Fields";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { labelType, placeholder } = this.props;
    const className = classnames(
      css(
        `${this.constructor.componentId}-fields`,
        `${this.getId()}-fields`,
        styleFormFields(v, vs, vd)
      )
    );
    const selectClassName = classnames(
      css(
        `${this.constructor.componentId}-field_select`,
        `${this.getId()}-field_select`,
        styleFormSelect(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend),
      itemProps: {
        labelType,
        placeholder,
        className,
        selectClassName,
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        ),
        toolbarExtendSelect: this.makeToolbarPropsFromConfig2(
          toolbarExtendSelect,
          sidebarExtendSelect,
          { allowExtend: false }
        )
      }
    });

    return <Form2FieldsItems {...itemsProps} />;
  }
}

export default Form2Fields;
