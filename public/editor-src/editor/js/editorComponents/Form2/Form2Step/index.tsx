import React from "react";
import { isEditor } from "visual/providers/RenderProvider";
import { ElementPatch } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { ViewType } from "../Form2Steps/types";
import { Divider } from "./Components/Divider";
import { Nav } from "./Components/Nav";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import type { Props, Value } from "./types";

class Form2Step extends EditorComponent<Value, Props> {
  static get componentId(): ElementTypes.Form2Step {
    return ElementTypes.Form2Step;
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: ElementPatch<Value>): void => {
    this.patchValue(patch);
  };

  renderNav(v: Value): React.JSX.Element {
    const { totalCount, active, activeStep, count, onActiveChange } =
      this.props;

    const _isEditor = isEditor(this.renderContext);
    let { viewType } = this.props;

    if (viewType === ViewType.None) {
      if (_isEditor) {
        // INFO: in editor we always render indicators for user so he can switch steps,
        // in preview steps can be changed by passing current step
        viewType = ViewType.Icon;
      } else {
        return <></>;
      }
    }

    const progressStyle = _isEditor
      ? {
          backgroundColor: count <= activeStep ? "" : "transparent"
        }
      : {};
    const progressValue = `${Math.floor((100 / totalCount) * count)} %`;

    return (
      <>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, undefined)}>
          <Nav
            v={v}
            active={active}
            viewType={viewType}
            progressStyle={progressStyle}
            progressValue={progressValue}
            order={count}
            onActiveChange={onActiveChange}
            onChange={this.handleTextChange}
            renderContext={this.renderContext}
          />
        </Toolbar>
        {!(viewType === ViewType.Progress) && count < totalCount && <Divider />}
      </>
    );
  }

  renderContent(): React.JSX.Element {
    const { labelType, placeholder, multistep, active, toolbarExtendFields } =
      this.props;

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        ...this.props,
        labelType,
        placeholder,
        multistep,
        active,
        toolbarExtend: toolbarExtendFields
      }
    });

    //  @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...itemProps} />;
  }

  renderForEdit(v: Value): React.JSX.Element {
    const { renderType } = this.props;

    return renderType === "nav" ? this.renderNav(v) : this.renderContent();
  }
}

export default Form2Step;
