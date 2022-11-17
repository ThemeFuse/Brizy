import classnames from "classnames";
import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import Form2FieldsItems from "./Items";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as sidebarExtendSelect from "./sidebarExtendSelect";
import { styleFormFields, styleFormSelect } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as toolbarExtendSelect from "./toolbarExtendSelect";

export interface Value extends ElementModel {
  labelType: string;
  placeholder: string;
}

class Form2Fields extends EditorComponent<Value> {
  static get componentId(): "Form2Fields" {
    return "Form2Fields";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { labelType, placeholder } = this.props;
    const className = classnames(
      css(
        `${this.getComponentId()}-fields`,
        `${this.getId()}-fields`,
        styleFormFields(v, vs, vd)
      )
    );
    const selectClassName = classnames(
      css(
        `${this.getComponentId()}-field_select`,
        `${this.getId()}-field_select`,
        styleFormSelect(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        // @ts-expect-error: need to transform in .ts
        toolbarExtend,
        sidebarExtend,
        { allowExtend: false }
      ),
      itemProps: {
        labelType,
        placeholder,
        className,
        selectClassName,
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          // @ts-expect-error: need to transform in .ts
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        ),
        toolbarExtendSelect: this.makeToolbarPropsFromConfig2(
          // @ts-expect-error: need to transform in .ts
          toolbarExtendSelect,
          sidebarExtendSelect,
          { allowExtend: false }
        )
      }
    });

    // @ts-expect-error: need review when EditorArrayComponent converted to TS
    return <Form2FieldsItems {...itemsProps} />;
  }
}

export default Form2Fields;
