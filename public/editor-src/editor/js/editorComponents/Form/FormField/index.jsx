import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import * as types from "./types/index";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import defaultValue from "./defaultValue";
import { fieldStyleClassName, fieldStyleCSSVars } from "./styles";

export default class Input extends EditorComponent {
  static get componentId() {
    return "FormField";
  }

  static defaultValue = defaultValue;

  renderForEdit(v) {
    const { type } = v;
    const Component = types[type];

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <div className={fieldStyleClassName(v)} style={fieldStyleCSSVars(v)}>
          <Component {...v} onChange={value => this.patchValue(value)} />
        </div>
      </Toolbar>
    );
  }
}
