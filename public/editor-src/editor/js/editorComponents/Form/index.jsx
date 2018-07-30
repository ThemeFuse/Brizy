import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import Items from "./Items";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendConfigButton from "./extendToolbarButton";

class Form extends EditorComponent {
  static get componentId() {
    return "Form";
  }

  static defaultValue = defaultValue;

  handleSubmit = e => {
    e.preventDefault();
  };

  renderForEdit(v) {
    const action = Config.get("applications").form.submitUrl;
    const projectLanguageId = Config.get("projectLanguage").id;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfigButton)
    });

    return (
      <div className={styleClassName(v)} style={styleCSSVars(v)}>
        <form
          action={action}
          noValidate
          data-form-id={v._id}
          data-project-language={projectLanguageId}
          data-success={v.messageSuccess}
          data-error={v.messageError}
          data-redirect={v.messageRedirect}
          onSubmit={this.handleSubmit}
        >
          <Items {...itemsProps} />
        </form>
      </div>
    );
  }
}

export default Form;
