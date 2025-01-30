import classnames from "classnames";
import React from "react";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Multistep } from "./Components/Multistep";
import Form2StepFieldItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarExtend from "./sidebarExtend";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import type { Props } from "./types";

class Form2Steps extends EditorComponent<ElementModel, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Form2Steps {
    return ElementTypes.Form2Steps;
  }

  renderForEdit(
    v: ElementModel,
    vs: ElementModel,
    vd: ElementModel
  ): React.JSX.Element {
    const {
      viewType,
      activeStep,
      labelType,
      placeholder,
      multistep,
      toolbarExtendFields,
      onActiveChange
    } = this.props;

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        renderType: "nav",
        viewType,
        activeStep,
        onActiveChange
      },
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtend,
        {
          allowExtend: false
        }
      )
    });

    const contentItemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        renderType: "content",
        activeStep,
        viewType,
        labelType,
        placeholder,
        multistep,
        toolbarExtendFields
      }
    });

    const className = classnames(
      `brz-form-ms-indicators-${viewType}`,
      this.css(
        `${this.getComponentId()}-${this.getId()}-indicators`,
        `${this.getId()}-indicators`,
        style({
          v,
          vs,
          vd,
          props: { viewType },
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Multistep
        className={className}
        // @ts-expect-error: Need transform EditorArrayComponents to ts
        steps={<Form2StepFieldItems {...itemsProps} />}
      >
        {/*@ts-expect-error: Need transform EditorArrayComponents to ts*/}
        <Form2StepFieldItems {...contentItemsProps} />
      </Multistep>
    );
  }
}

export default Form2Steps;
