import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component-new/Toolbar";
import * as types from "./types/index";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue";
import { fieldStyleClassName, fieldStyleCSSVars } from "./styles";

class Input extends EditorComponent {
  static get componentId() {
    return "FormField";
  }

  static defaultValue = defaultValue;

  renderForEdit(v) {
    const { type } = v;
    const Component = types[type];

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div className={fieldStyleClassName(v)} style={fieldStyleCSSVars(v)}>
          <Component {...v} onChange={value => this.patchValue(value)} />
        </div>
      </Toolbar>
    );
  }
}

export default Input;
