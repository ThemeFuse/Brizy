import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { FormFields } from "./Components/FormFields";
import defaultValue from "./defaultValue.json";
import Form2FieldsItems from "./Items";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as sidebarExtendSelect from "./sidebarExtendSelect";
import { styleFormFields, styleFormSelect } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as toolbarExtendSelect from "./toolbarExtendSelect";
import type { Props, Value } from "./types";

class Form2Fields extends EditorComponent<Value, Props> {
  static get componentId(): "Form2Fields" {
    return "Form2Fields";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const { labelType, placeholder, multistep, active } = this.props;

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

    const toolbarProps = {
      toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
        // @ts-expect-error: need to transform in .ts
        toolbarExtendLabel,
        sidebarExtendLabel,
        { allowExtend: false }
      ),
      toolbarExtendSelect: this.makeToolbarPropsFromConfig2(
        toolbarExtendSelect,
        sidebarExtendSelect,
        { allowExtend: false }
      )
    };

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        // @ts-expect-error: need to transform in .ts
        toolbarExtend,
        sidebarExtend
      ),
      itemProps: {
        labelType,
        placeholder,
        className,
        selectClassName,
        ...toolbarProps
      }
    });

    // @ts-expect-error: EditorArrayComponent is still in .js
    const items = <Form2FieldsItems {...itemsProps} />;

    if (multistep === "on") {
      return (
        <FormFields style={{ display: active ? "block" : "none" }}>
          {items}
        </FormFields>
      );
    }

    return items;
  }
}

export default Form2Fields;
