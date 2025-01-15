import React from "react";
import { isEditor } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";

export default class Hidden extends TextField {
  static get componentTitle() {
    return t("Hidden");
  }

  static get componentType() {
    return "Hidden";
  }

  static Label(...props) {
    // input hidden don't have label on preview
    return isEditor(props[0].renderContext) ? super.Label(...props) : null;
  }

  renderForView(v) {
    const { attr } = v;

    return (
      <input {...attr} required={false} className={this.getClassName(v)} />
    );
  }
}
