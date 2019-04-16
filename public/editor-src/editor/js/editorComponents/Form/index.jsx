import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Config from "visual/global/Config";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendConfigButton from "./extendToolbarButton";
import * as parentToolbarExtend from "./parentExtendToolbar";

class Form extends EditorComponent {
  static get componentId() {
    return "Form";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false,
      filterExtendName: `${this.constructor.componentId}_parent`
    });
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  renderForEdit(v) {
    const action = Config.get("form").submitUrl;
    const projectId = Config.get("project").id;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.props.meta,
        toolbarExtend: this.makeToolbarPropsFromConfig(
          toolbarExtendConfigButton
        )
      }
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={styleClassName(v)} style={styleCSSVars(v)}>
          <form
            noValidate
            action={action}
            data-project-id={projectId}
            data-form-id={v._id}
            data-success={v.messageSuccess}
            data-error={v.messageError}
            data-redirect={v.messageRedirect}
            onSubmit={this.handleSubmit}
          >
            <EditorArrayComponent {...itemsProps} />
          </form>
        </div>
      </CustomCSS>
    );
  }
}

export default Form;
